import { Injectable } from '@nestjs/common';
import { VaultInstance } from '@src/libs/vault.util.ts';
import { CreateShipmentReq } from '@src/modules/grpc/proto/ler.pb';
import {
  AddressDto,
  CreateOrderDto,
  OrderDetailDto,
  SellerUserType,
  ShipmentType,
  TorodAddressTypeEnum,
  TorodPaymentOptionEnum,
  TorodStatus,
  TorordShiptemntType,
  CourierOrderDto,
} from '@src/modules/vendor/dto/torod.dto';
import { TorodLib } from '@src/modules/vendor/torod/torod';
import { IProvider } from '../vendor.interface';
import { CourierCaseEnum } from '../enum/courier-case.enum';

@Injectable()
export class TorodShipmentService implements IProvider {
  constructor(private readonly vaultInstance: VaultInstance) {}
  async cancelShipment(trackingOrOrderId: string) {
    const order: OrderDetailDto = await TorodLib.orderDetails({
      order_id: trackingOrOrderId,
    });
    if (
      !order ||
      !order.tracking_id ||
      ![TorodStatus.CREEATED, TorodStatus.PENDING].includes(
        order?.status as TorodStatus,
      )
    ) {
      console.log(
        `Order with id ${trackingOrOrderId} does not support status change as it is ${order?.status} or not found`,
      );
      return {
        success: false,
        message:
          'Order with id ${trackingOrOrderId} does not support status change as it is ${order?.status} or not found',
      };
    }
    await TorodLib.cancelShipment({
      tracking_or_order_id: order.tracking_id || trackingOrOrderId,
    });
    return {
      success: true,
      message: 'order was cancelled ',
    };
  }

  private async handleJarirPhoneOverride(createOrderDto: CreateShipmentReq) {
    const secretData = await this.vaultInstance.getSecretData('ler');
    const jarirOldPhone = secretData?.jarirOldPhone;
    const jarirNewPhone = secretData?.jarirNewPhone;
    if (
      createOrderDto.sender.mobileNumber === jarirOldPhone &&
      ShipmentType.FIRST_MILE == createOrderDto.shipmentType
    ) {
      createOrderDto.sender.mobileNumber = jarirNewPhone;
    }
    return createOrderDto;
  }

  async createShipmentOrder(createOrderDto: CreateShipmentReq) {
    const isValidKsaPhone = (phone: string) =>
      /^(?:\+966|0)(5\d{8})$/.test(phone);

    // Jarir Order - Create Shipment w/ Jarir Contact
    createOrderDto = await this.handleJarirPhoneOverride(createOrderDto);

    createOrderDto.sender.mobileNumber = isValidKsaPhone(
      createOrderDto.sender.mobileNumber,
    )
      ? createOrderDto.sender.mobileNumber
      : '+966511111111';
    createOrderDto.receiver.mobileNumber = isValidKsaPhone(
      createOrderDto.receiver.mobileNumber,
    )
      ? createOrderDto.receiver.mobileNumber
      : '+966511111110';

    /* Start create address for shipment */
    const parseLatLong = (val: any) => {
      const num = parseFloat(val);
      return !isNaN(num) ? num : undefined;
    };
    const torodSenderAddress = await this.createCustomerAddress({
      contact_name: createOrderDto.sender.name,
      phone_number: createOrderDto.sender.mobileNumber,
      warehouse_name: createOrderDto.sender.name,
      email: createOrderDto.sender.email,
      locate_address: createOrderDto.sender.address,
      latitude: parseLatLong(createOrderDto.sender.latitude),
      longitude: parseLatLong(createOrderDto.sender.longitude)
    });
    const torodReceiverAddress = await this.createCustomerAddress({
      contact_name: createOrderDto.receiver.name,
      phone_number: createOrderDto.receiver.mobileNumber,
      warehouse_name: createOrderDto.receiver.name,
      email: createOrderDto.receiver.email,
      locate_address: createOrderDto.receiver.address,
      latitude: parseLatLong(createOrderDto.receiver.latitude),
      longitude: parseLatLong(createOrderDto.receiver.longitude)
    });
    const validationResult = await this.validateOrderCreation(
      createOrderDto,
      torodSenderAddress,
      torodReceiverAddress,
    );
    if (!validationResult.isValid)
      throw Error(validationResult.errors.join(','));
    if (ShipmentType.FIRST_MILE == createOrderDto.shipmentType) {
      return this.firstMile(
        createOrderDto,
        torodSenderAddress,
        torodReceiverAddress,
      );
    } else if (ShipmentType.LAST_MILE == createOrderDto.shipmentType) {
      return this.lastMile(
        createOrderDto,
        torodSenderAddress,
        torodReceiverAddress,
      );
    } else if (ShipmentType.REVERSE_LAST_MILE == createOrderDto.shipmentType) {
      return this.reverseLastMile(
        createOrderDto,
        torodSenderAddress,
        torodReceiverAddress,
      );
    } else {
      return null;
    }
  }

  async validateOrderCreation(
    createOrderDto: CreateShipmentReq,
    torodSenderAddress: AddressDto,
    torodReceiverAddress: AddressDto,
  ) {
    const errors: string[] = [];
    const isString = (value: any) =>
      typeof value === 'string' && value.trim() !== '';
    const isNumber = (value: any) => typeof value === 'number' && !isNaN(value);
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidKsaPhone = (phone: string) =>
      /^(?:\+966|0)(5\d{8})$/.test(phone); // KSA numbers start with +966 or 05 followed by 8 digits.

    if (!isString(createOrderDto.sender.city))
      errors.push('Origin city is required and must be a non-empty string.');
    if (!isString(createOrderDto.receiver.city))
      errors.push(
        'Destination city is required and must be a non-empty string.',
      );
    if (!isString(createOrderDto.sender.name))
      errors.push('Sender name is required and must be a non-empty string.');
    if (!isValidKsaPhone(createOrderDto.sender.mobileNumber))
      errors.push('Sender phone must be a valid KSA phone number.');
    if (!isString(createOrderDto.sender.address))
      errors.push('Sender address is required and must be a non-empty string.');
    if (!isString(createOrderDto.receiver.name))
      errors.push('Receiver name is required and must be a non-empty string.');
    if (!isValidKsaPhone(createOrderDto.receiver.mobileNumber))
      errors.push('Receiver phone must be a valid KSA phone number.');
    if (!isString(createOrderDto.receiver.address))
      errors.push(
        'Receiver address is required and must be a non-empty string.',
      );
    // if (
    //   createOrderDto.trackingNumber !== null &&
    //   !isString(createOrderDto.trackingNumber)
    // )
    //   errors.push('Tracking number must be a string or null.');
    if (!isString(createOrderDto.description))
      errors.push('Description is required and must be a non-empty string.');
    if (!isValidEmail(createOrderDto.receiver.email))
      errors.push('Receiver email must be a valid email address.');
    if (!isValidEmail(createOrderDto.sender.email))
      errors.push('Sender email must be a valid email address.');
    if (!isNumber(createOrderDto.grandTotal) || createOrderDto.grandTotal < 0)
      errors.push('Grand total must be a positive number.');
    if (
      !Object.values(ShipmentType).includes(
        createOrderDto.shipmentType as ShipmentType,
      )
    )
      errors.push(
        "Shipment type must be one of: 'firstMile', 'lastMile', or 'direct'.",
      );

    if (!torodSenderAddress || !torodReceiverAddress)
      throw Error('seller or buyer adderess was not created');
    const courierPartnerId = await this.getCourierIdforOrder({
      BuyerCityId: torodReceiverAddress.cities_id,
      sellerCityId: torodSenderAddress.cities_id,
      sellerMobileNumber: createOrderDto.sender.mobileNumber,
      sellerType: createOrderDto.sender.userType,
      shipmentType: createOrderDto.shipmentType as ShipmentType,
      isConsignment: createOrderDto.isConsignment,
    });

    if (!courierPartnerId) errors.push('Order will be handle outside of torod');
    console.log('shipment order Errors', errors);
    return { isValid: errors.length === 0, errors };
  }

  async getCourierIdforOrderOld(data: {
    sellerCityId: number;
    BuyerCityId: number;
    sellerMobileNumber: string;
    sellerType: string;
    shipmentType: ShipmentType;
  }) {
    // PLZ NOTE THAT Riyadh ID IS 3 AND JEDDAH IS 2108
    const secretData = await this.vaultInstance.getSecretData('apiv2');
    const sellersForAutomation = JSON.parse(
      secretData?.selectSellersForAutomation || '[]',
    );

    const fbsSellers = JSON.parse(secretData?.fbsSellers || '[]');

    // First Mile - Individual Seller - RUH → RUH
    const case1 =
      data.sellerCityId == 3 &&
      data.BuyerCityId == 3 &&
      ShipmentType.FIRST_MILE == data.shipmentType &&
      SellerUserType.INDIVIDUAL_SELLER == data.sellerType;

    // First Mile - Business Seller - RUH → RUH
    const case2 =
      data.sellerCityId == 3 &&
      data.BuyerCityId == 3 &&
      ShipmentType.FIRST_MILE == data.shipmentType &&
      (SellerUserType.KEY_SELLER == data.sellerType ||
        SellerUserType.MERCHANT_SELLER == data.sellerType);

    // First Mile - Select JED Sellers - JED → JED
    const case3 =
      data.sellerCityId == 2108 &&
      data.BuyerCityId == 2108 &&
      ShipmentType.FIRST_MILE == data.shipmentType &&
      (sellersForAutomation || []).includes(data.sellerMobileNumber);

    // Last Mile - RUH-FBS → RUH
    const case4 =
      data.sellerCityId == 3 &&
      data.BuyerCityId == 3 &&
      ShipmentType.LAST_MILE == data.shipmentType &&
      (fbsSellers || []).includes(data.sellerMobileNumber);

    let courierId = 0;
    if (case1) {
      // CloudShelf for now soum drivers
      courierId = 0;
    } else if (case2) {
      // soum drivers
      courierId = 0;
    } else if (case3) {
      // Hannad
      courierId = 0;
    } else if (case4) {
      // Barq
      courierId = 43;
    } else {
      // SMSA
      courierId = 1;
    }

    return courierId;
  }

  private async getCourierIdFromConfig(
    caseName: CourierCaseEnum,
  ): Promise<number> {
    const secretData = await this.vaultInstance.getSecretData('ler');
    const courierAssignation = JSON.parse(
      secretData?.torodCourierAssignation || '[]',
    );

    const matchingCase = courierAssignation.find(
      (config: { caseName: string; courierId: number }) =>
        config.caseName === caseName,
    );
    return matchingCase?.courierId || 1;
  }

  async getCourierIdforOrder(data: CourierOrderDto) {
    // Constants
    const RIYADH_ID = 3;
    const JEDDAH_ID = 2108;

    // Get FBS sellers list from vault
    const secretData = await this.vaultInstance.getSecretData('apiv2');
    const fbsSellers = JSON.parse(secretData?.fbsSellers || '[]');

    // Helper functions
    const isRiyadhOrJeddah = (cityId: number) =>
      cityId === RIYADH_ID || cityId === JEDDAH_ID;
    const isFbsSeller = (mobileNumber: string) =>
      (fbsSellers || []).includes(mobileNumber);

    // Last Mile Cases
    if (data.shipmentType === ShipmentType.LAST_MILE) {
      // Case 5: Consignment Last Mile in Riyadh
      if (data.isConsignment && data.BuyerCityId === RIYADH_ID) {
        return this.getCourierIdFromConfig(
          CourierCaseEnum.CONSIGNMENT_RIYADH_LM,
        );
      }

      // Case 6: Consignment Last Mile in Other Cities
      if (data.isConsignment && data.BuyerCityId !== RIYADH_ID) {
        return this.getCourierIdFromConfig(
          CourierCaseEnum.CONSIGNMENT_OTHER_CITIES_LM,
        );
      }

      // Case 7: Standard FBS Last Mile in Riyadh
      if (
        !data.isConsignment &&
        isFbsSeller(data.sellerMobileNumber) &&
        data.BuyerCityId === RIYADH_ID
      ) {
        return this.getCourierIdFromConfig(
          CourierCaseEnum.STANDARD_FBS_RIYADH_LM,
        );
      }

      // Case 8: Standard Last Mile in Other Cities
      if (!data.isConsignment && data.BuyerCityId !== RIYADH_ID) {
        return this.getCourierIdFromConfig(
          CourierCaseEnum.STANDARD_OTHER_CITIES_LM,
        );
      }
    }

    // First Mile Cases
    if (data.isConsignment) {
      // Case 3: Consignment First Mile in Riyadh/Jeddah
      if (isRiyadhOrJeddah(data.sellerCityId)) {
        return this.getCourierIdFromConfig(
          CourierCaseEnum.CONSIGNMENT_RIYADH_JEDDAH_FM,
        );
      }

      // Case 4: Consignment First Mile in Other Cities
      return this.getCourierIdFromConfig(
        CourierCaseEnum.CONSIGNMENT_OTHER_CITIES_FM,
      );
    }

    // Standard First Mile Cases
    // Case 1: Standard First Mile in Riyadh/Jeddah
    if (isRiyadhOrJeddah(data.sellerCityId)) {
      return this.getCourierIdFromConfig(
        CourierCaseEnum.STANDARD_RIYADH_JEDDAH_FM,
      );
    }

    // Case 2: Standard First Mile in Other Cities
    return this.getCourierIdFromConfig(
      CourierCaseEnum.STANDARD_OTHER_CITIES_FM,
    );
  }

  async getSoumDestinationAddress(torodSenderAddress: AddressDto) {
    const RiyadhInspectionCenter = {
      contact_name: 'Soum Riyadh',
      phone_number: '+966555012674',
      warehouse_name: 'Riyadh Inspection Center',
      warehouse: 'SOUMRiyadh',
      email: 'n.noor@soum.sa',
      type: TorodAddressTypeEnum.ADDRESS,
      locate_address: '4134 Al Thoumamah Rd, Riyadh Saudi Arabia',
      city: 'Riyadh',
      cities_id: 3,
    };

    return RiyadhInspectionCenter;
  }

  async firstMile(
    createOrderDto: CreateShipmentReq,
    torodSenderAddress: AddressDto,
    torodReceiverAddress: AddressDto,
  ) {
    /* Start create order */
    const soumDestinationAddress = await this.getSoumDestinationAddress(
      torodSenderAddress,
    );

    const createOrderDtoFirstMile: CreateOrderDto =
      this.CreateShipmentReqToCreateOrderDto(
        createOrderDto,
        null,
        soumDestinationAddress,
      );
    const torodOrder: any = await TorodLib.createOrder(createOrderDtoFirstMile);

    if (!torodSenderAddress) {
      // return errorCode
      return null;
    }
    const courierPartnerId = await this.getCourierIdforOrder({
      BuyerCityId: torodReceiverAddress.cities_id,
      sellerCityId: torodSenderAddress.cities_id,
      sellerMobileNumber: createOrderDto.sender.mobileNumber,
      sellerType: createOrderDto.sender.userType,
      shipmentType: ShipmentType.FIRST_MILE,
      isConsignment: createOrderDto.isConsignment,
    });

    if (!courierPartnerId) return torodOrder?.order_id;

    /* Start create shipment */
    await TorodLib.shipOrder({
      courier_partner_id: courierPartnerId,
      order_id: torodOrder?.order_id,
      type: TorordShiptemntType.NORMAL,
      warehouse: torodSenderAddress?.warehouse,
    });
    return torodOrder?.order_id;
  }

  async lastMile(
    createOrderDto: CreateShipmentReq,
    torodSenderAddress: AddressDto,
    torodReceiverAddress: AddressDto,
  ) {
    const soumSourceAddress = await this.getSoumDestinationAddress(
      torodSenderAddress,
    );

    const createOrderDtoLastMile: CreateOrderDto =
      this.CreateShipmentReqToCreateOrderDto(createOrderDto, 'buyer', null);
    const torodOrder: any = await TorodLib.createOrder(createOrderDtoLastMile);

    if (!torodReceiverAddress) {
      // return errorCode
      return null;
    }
    const courierPartnerId = await this.getCourierIdforOrder({
      BuyerCityId: torodReceiverAddress.cities_id,
      sellerCityId: torodSenderAddress.cities_id,
      sellerMobileNumber: createOrderDto.sender.mobileNumber,
      sellerType: createOrderDto.sender.userType,
      shipmentType: ShipmentType.LAST_MILE,
      isConsignment: createOrderDto.isConsignment,
    });

    if (!courierPartnerId) return torodOrder?.order_id;

    /* Start create shipment */
    await TorodLib.shipOrder({
      courier_partner_id: courierPartnerId,
      order_id: torodOrder?.order_id,
      type: TorordShiptemntType.NORMAL,
      warehouse: soumSourceAddress?.warehouse,
    });
    return torodOrder?.order_id;
  }

  async reverseLastMile(
    createOrderDto: CreateShipmentReq,
    torodSenderAddress: AddressDto,
    torodReceiverAddress: AddressDto,
  ) {
    const soumDestinationAddress = await this.getSoumDestinationAddress(
      torodSenderAddress,
    );

    const createOrderDtoReverseLastMile: CreateOrderDto =
      this.CreateShipmentReqToCreateOrderDto(
        createOrderDto,
        null,
        soumDestinationAddress,
      );

    const torodOrder: any = await TorodLib.createOrder(
      createOrderDtoReverseLastMile,
    );
    if (!torodReceiverAddress) {
      // return errorCode
      return null;
    }

    const courierPartnerId = await this.getCourierIdforOrder({
      BuyerCityId: torodReceiverAddress.cities_id,
      sellerCityId: torodSenderAddress.cities_id,
      sellerMobileNumber: createOrderDto.sender.mobileNumber,
      sellerType: createOrderDto.sender.userType,
      shipmentType: ShipmentType.FIRST_MILE,
      isConsignment: createOrderDto.isConsignment,
    });

    if (!courierPartnerId) return torodOrder?.order_id;
    await TorodLib.shipOrder({
      courier_partner_id: courierPartnerId,
      order_id: torodOrder?.order_id,
      type: TorordShiptemntType.NORMAL,
      warehouse: torodReceiverAddress?.warehouse,
    });
    return torodOrder?.order_id;
  }

  async createCustomerAddress(createAddressDto: AddressDto) {
    try {
      const warehouse = `CUS${createAddressDto.phone_number}`.replace('+', '');

      createAddressDto.warehouse = warehouse;
      createAddressDto.type = TorodAddressTypeEnum.ADDRESS;

      let torodUserAddress = await TorodLib.getAddressDetails(warehouse);
      // validate same address is pushed
      if (
        torodUserAddress &&
        torodUserAddress.locate_address !== createAddressDto.locate_address
      ) {
        await TorodLib.updateAddress(torodUserAddress.id, createAddressDto);
        torodUserAddress = await TorodLib.getAddressDetails(warehouse);
        return torodUserAddress;
      }

      if (
        torodUserAddress &&
        torodUserAddress.locate_address == createAddressDto.locate_address
      ) {
        return torodUserAddress;
      }

      return await TorodLib.createAddress(createAddressDto);
    } catch (error) {
      // should handle what to be done in case address is not created
      return null;
    }
  }

  /* General Helper/Mapper functions */
  CreateShipmentReqToCreateOrderDto(
    createShipmentReq: CreateShipmentReq,
    usedAddress?: string,
    address?: AddressDto,
  ) {
    if (address) {
      const hasValidLatLong =
        !isNaN(address.latitude) && !isNaN(address.longitude);
      return {
        name: address.warehouse_name,
        email: address.email,
        phone_number: address.phone_number,
        item_description: `${createShipmentReq.description} - ${createShipmentReq.trackingNumber}`,
        order_total: createShipmentReq.grandTotal.toString() || '0',
        payment: TorodPaymentOptionEnum.PREPAID,
        weight: '1',
        no_of_box: '1',
        type: hasValidLatLong
          ? TorodAddressTypeEnum.LAT_LONG
          : TorodAddressTypeEnum.ADDRESS,
        locate_address: address.locate_address,
        lat: address.latitude,
        long: address.longitude,
      };
    }

    if (usedAddress == 'buyer') {
      const hasValidLatLong =
        address &&
        typeof address.latitude === 'number' &&
        !isNaN(address.latitude) &&
        typeof address.longitude === 'number' &&
        !isNaN(address.longitude);
      return {
        name: createShipmentReq.receiver.name,
        email: createShipmentReq.receiver.email,
        phone_number: createShipmentReq.receiver.mobileNumber,
        item_description: `${createShipmentReq.description} - ${createShipmentReq.trackingNumber}`,
        order_total: createShipmentReq.grandTotal.toString() || '0',
        payment: TorodPaymentOptionEnum.PREPAID,
        weight: '1',
        no_of_box: '1',
        type: hasValidLatLong ? TorodAddressTypeEnum.LAT_LONG : TorodAddressTypeEnum.ADDRESS,
        locate_address: createShipmentReq.receiver.address,
        lat: address?.latitude,
        long: address?.longitude
      };
    }

    if (usedAddress == 'seller') {
      const hasValidLatLong =
        address &&
        typeof address.latitude === 'number' &&
        !isNaN(address.latitude) &&
        typeof address.longitude === 'number' &&
        !isNaN(address.longitude);
      return {
        name: createShipmentReq.sender.name,
        email: createShipmentReq.sender.email,
        phone_number: createShipmentReq.sender.mobileNumber,
        item_description: `${createShipmentReq.description} - ${createShipmentReq.trackingNumber}`,
        order_total: createShipmentReq.grandTotal.toString() || '0',
        payment: TorodPaymentOptionEnum.PREPAID,
        weight: '1',
        no_of_box: '1',
        type: hasValidLatLong ? TorodAddressTypeEnum.LAT_LONG : TorodAddressTypeEnum.ADDRESS,
        locate_address: createShipmentReq.sender.address,
        lat: address?.latitude,
        long: address?.longitude
      };
    }
  }
}
