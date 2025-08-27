import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export enum SellerUserType {
  KEY_SELLER = 'KeySeller',
  ALL_SELLERS = 'AllSellers',
  MERCHANT_SELLER = 'MerchantSeller',
  INDIVIDUAL_SELLER = 'IndividualSeller',
  UAE_SELLER = 'UAESeller',
}

export enum TorodStatus {
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  CREEATED = 'Created',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  FAILED = 'Failed',
  RTO = 'RTO',
  DAMAGED = 'Damage',
  LOST = 'Lost',
}

export enum TorodAddressTypeEnum {
  ADDRESS = 'address',
  NORMAL = 'normal',
  LAT_LONG = 'latlong',
}

export enum TorodPaymentOptionEnum {
  PREPAID = 'Prepaid',
}

export enum TorodFilterByEnum {
  CHEAPEST = 'cheapest',
  FASTEST = 'fastest',
}

export enum TorordShiptemntType {
  NORMAL = 'normal',
}

export enum TorordShiptemntStatus {
  READY_PICK_UP = 'Ready for pickup',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  FAILED_ATTEMPET = 'Failed Attempt',
  FAITLED_DELIVERY = 'Failed Delivery',
}

export enum ShipmentType {
  FIRST_MILE = 'firstMile',
  LAST_MILE = 'lastMile',
  DIRECT = 'direct',
  REVERSE_LAST_MILE = 'reverseLastMile',
  POST_INSPECTION = 'postInspection',
}
// DTO Definitions
export class CreateTokenDto {
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;
}

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  warehouse_name: string;

  @IsNotEmpty()
  @IsString()
  warehouse?: string;

  @IsNotEmpty()
  @IsString()
  contact_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsNotEmpty()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  district_id?: string;

  @IsOptional()
  @IsString()
  cities_id?: number;

  @IsOptional()
  @IsString()
  locate_address?: string;

  @IsOptional()
  @IsString()
  latitude?: number;

  @IsOptional()
  @IsString()
  longitude?: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  item_description: string;

  @IsNotEmpty()
  @IsNumber()
  order_total: number;

  @IsNotEmpty()
  @IsString()
  payment: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  no_of_box: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  district_id?: string;

  @IsOptional()
  @IsString()
  locate_address?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city_id?: string;
}

export class GetCouriersDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  warehouse: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  filter_by: string;

  @IsOptional()
  @IsString()
  is_insurance?: string;
}

export class ShipOrderDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  warehouse: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  courier_partner_id: number;

  @IsOptional()
  @IsString()
  is_own?: string;

  @IsOptional()
  @IsString()
  is_insurance?: string;
}

export class OrderDetailDtoReq {
  @IsNotEmpty()
  @IsString()
  order_id: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  item_description: string;

  @IsNotEmpty()
  @IsNumber()
  order_total: string;

  @IsNotEmpty()
  @IsString()
  payment: string;

  @IsNotEmpty()
  @IsNumber()
  weight: string;

  @IsNotEmpty()
  @IsNumber()
  no_of_box: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  district_id?: string;

  @IsOptional()
  @IsString()
  locate_address?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city_id?: string;
}

export class CancelShipmentDto {
  @IsString()
  tracking_or_order_id?: string;
}

export class OrderDetailDto {
  @IsString()
  order_id: string;

  @IsString()
  store_id: string;

  @IsString()
  status: string;

  @IsString()
  payment: string;

  @IsNumber()
  total: number;

  @IsString()
  total_string: string;

  @IsString()
  tracking_id: string; // Correctly included tracking_id

  @IsString()
  item_description: string;

  @IsNumber()
  no_of_box: number;

  @IsString()
  weight: string;

  @IsDateString()
  created_at: string;
}

export class CourierOrderDto {
  sellerCityId: number;
  BuyerCityId: number;
  sellerMobileNumber: string;
  sellerType: string;
  shipmentType: ShipmentType;
  isConsignment?: boolean;
}
