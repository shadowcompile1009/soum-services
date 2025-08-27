import axios from 'axios';

import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AddressDto,
  CancelShipmentDto,
  CreateOrderDto,
  GetCouriersDto,
  OrderDetailDtoReq,
  ShipOrderDto,
} from '../dto/torod.dto.js';

require('dotenv').config();

export class TorodLib {
  private static apiBaseUrl = process.env.TOROD_BASE_URL;
  private static apiTokenUrl = `${this.apiBaseUrl}/token`;
  private static apiCreateAddressUrl = `${this.apiBaseUrl}/create/address`;
  private static apiUpdateAddressUrl = `${this.apiBaseUrl}/update/address`;
  private static apiGetCouriersUrl = `${this.apiBaseUrl}/courier/partners`;
  private static apiShipOrderUrl = `${this.apiBaseUrl}/order/ship/process`;
  private static apiGetOrderDetailsUrl = `${this.apiBaseUrl}/order/details`;
  private static apiCreateProductUrl = `${this.apiBaseUrl}/order/create`;
  private static apiCancelShipmentUrl = `${this.apiBaseUrl}/shipments/cancel`;
  private static apiGetShipmentUrl = `${this.apiBaseUrl}/shipment/details`;
  private static apiAddressDetailsUrl = `${this.apiBaseUrl}/address/details`;

  static async createToken(): Promise<any> {
    try {
      const formData = new URLSearchParams();
      formData.append('client_id', process.env.TOROD_CLIENT_ID);
      formData.append('client_secret', process.env.TOROD_CLIENT_SECRET);

      const response = await axios.post(this.apiTokenUrl, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const reqResult = response?.data;
      return reqResult?.data?.bearer_token || null;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create token',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async createAddress(createAddressDto: AddressDto): Promise<any> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();

      Object.entries(createAddressDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const response = await axios.post(this.apiCreateAddressUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const responseResult = response?.data;
      return responseResult?.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create address',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async updateAddress(
    id: string,
    createAddressDto: AddressDto,
  ): Promise<any> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();
      Object.entries(createAddressDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const response = await axios.post(
        `${this.apiUpdateAddressUrl}/${id}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const responseResult = response?.data;
      return responseResult?.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to update address',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async getAddressDetails(warehouse: string): Promise<any> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();
      formData.append('warehouse', warehouse);

      const response = await axios.post(this.apiAddressDetailsUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const responseResult = response.data;
      return responseResult?.data || null;
    } catch (error) {
      return null;
    }
  }

  static async getCouriers(getCouriersDto: GetCouriersDto): Promise<any> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();

      Object.entries(getCouriersDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const response = await axios.post(this.apiGetCouriersUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const responseResult = response.data;
      return responseResult?.data || [];
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to get couriers',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async shipOrder(shipOrderDto: ShipOrderDto): Promise<any> {
    try {
      const token = await this.createToken();

      const formData = new URLSearchParams();

      Object.entries(shipOrderDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const response = await axios.post(this.apiShipOrderUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const responseResult = response.data;
      return responseResult?.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to ship order',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async orderDetails(orderDetailDto: OrderDetailDtoReq): Promise<any> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();

      Object.entries(orderDetailDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const response = await axios.post(this.apiGetOrderDetailsUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const orderResult = response?.data;
      return orderResult?.data || null;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to get order detail',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async createOrder(createOrderDto: CreateOrderDto): Promise<string> {
    try {
      const token = await this.createToken();
      const formData = new URLSearchParams();
      Object.entries(createOrderDto).forEach(([key, value]) => {
        formData.append(key, value || '');
      });
      const response = await axios.post(this.apiCreateProductUrl, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `${token}`,
        },
      });
      const createOrderResult = response?.data;
      return createOrderResult?.data || null;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data || 'Failed to create order',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async cancelShipment(
    cancelShipmentDto: CancelShipmentDto,
  ): Promise<any> {
    try {
      const token = await this.createToken();

      const formData = new FormData();
      formData.append(
        'tracking_or_order_id',
        cancelShipmentDto.tracking_or_order_id,
      );
      const response = await axios.post(this.apiCancelShipmentUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseResult = response.data;
      return responseResult?.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to cancel shipment',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static async getShipment(cancelShipmentDto: CancelShipmentDto): Promise<any> {
    try {
      const token = await this.createToken();

      const formData = new FormData();
      formData.append('tracking_id', cancelShipmentDto.tracking_or_order_id);
      const response = await axios.post(this.apiGetShipmentUrl, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseResult = response.data;
      return responseResult?.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to get shipment',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
