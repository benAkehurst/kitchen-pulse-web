import { ObjectId } from 'mongoose';

export interface Order {
  orderId: string;
  orderDate: string;
  orderItems: string;
  quantity: number;
  totalPrice: number;
  orderFileRef: string;
  customer: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface Customer {
  name: string;
  company: string;
  email: string;
  telephone: string;
  address: string;
  contactable: boolean;
  ownedBy: ObjectId;
}
