import { ObjectId } from 'mongoose';

export interface Order {
  orderId: string;
  orderDate: string;
  orderItems: string;
  quantity: string;
  totalPrice: number;
  category?: string,
  itemId?: string,
  orderFileRef: string;
  customer: string;
  externalCustomerId: string;
  externalId: string;
  createdAt?: Date;
  updatedAt?: Date;
  associatedCustomer?: Customer
}

export interface UpdatingOrder {
  orderId: string;
  orderDate: string;
  orderItems: string;
  quantity: number;
  totalPrice: number;
}

export interface ManualOrder {
  externalCustomerId: string,
  orderItems: string,
  quantity: string,
  totalPrice: number,
  orderDate: Date
}

export interface User {
  email?: string;
  name?: string;
  avatar?: string;
  telephone?: string;
  company?: string;
}

export interface Message {
  orderReference: ObjectId;
  customerReference: ObjectId;
  repeat: boolean;
  repeatUntil: Date;
  scheduled: boolean;
  sendOnDate: Date;
  messageContents: string;
  messageFormat: string;
  messageSent: boolean;
}

export interface SendMessageData {
  customerExternalId: string;
  messageContents: string;
  messageFormat: string;
  orderReference?: string;
  scheduled?: boolean;
  sendOnDate?: Date;
}

export interface Customer {
  name: string;
  company: string;
  email: string;
  telephone: string;
  address: string;
  contactable: boolean;
  internalCustomerId?: string;
  externalId?: string;
}
