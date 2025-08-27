export type SellerType = 'seller';
export type BuyerType = 'buyer';
export type CustomerType = BuyerType | SellerType;

export interface ICustomer {
  id: string;
  customerType: CustomerType;
  name: string;
  city: string;
  phone: string;
  promo?: string;
  address?: string;
}

export class Customer {
  public id: string;
  public customerType: CustomerType;
  public name: string;
  public city: string;
  public phone: string;
  public promo?: string;
  public address?: string;

  constructor({
    id,
    customerType,
    city,
    phone,
    promo,
    address,
    name,
  }: ICustomer) {
    this.id = id;
    this.customerType = customerType;
    this.city = city;
    this.phone = phone;
    this.promo = promo;
    this.address = address;
    this.name = name;
  }
}

export interface IBuyer extends Omit<Customer, 'customerType'> {
  refundAmount?: number;
}

export interface ISeller extends Omit<Customer, 'customerType'> {
  payoutAmount?: number;
}

export class Seller extends Customer {
  public payoutAmount: number;
  constructor({
    id,
    name,
    city,
    phone,
    promo = '',
    address = '',
    payoutAmount = 0,
  }: ISeller) {
    super({ id, name, customerType: 'seller', city, phone, promo, address });
    this.payoutAmount = payoutAmount;
  }
}

export class Buyer extends Customer {
  public refundAmount: number;
  constructor({
    id,
    name,
    city,
    phone,
    promo = '',
    address = '',
    refundAmount = 0,
  }: IBuyer) {
    super({ id, name, customerType: 'buyer', city, phone, promo, address });
    this.refundAmount = refundAmount;
  }
}
