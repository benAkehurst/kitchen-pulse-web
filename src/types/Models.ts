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
  mobile?: string;
  company?: string;
}

export interface Message {
  externalCustomerReference: string;
  externalId: string;
  repeat: boolean;
  repeatUntil: Date;
  scheduled: boolean;
  sendOnDate: Date;
  messageContents: string;
  messageFormat: string;
  messageSent: boolean;
  orderReference?: ObjectId;
  customerReference?: ObjectId;
  associatedCustomer?: AssociatedCustomer;
  createdAt?: Date
}

export interface EditMessage {
  messageContents: string;
  sendOnDate: Date;
  scheduled: boolean;
  repeat: boolean;
  repeatUntil: Date
}

export interface SendMessageData {
  recipientType: string;
  recipientExternalIds: Array<string>;
  messageContents: string;
  messageFormat: string;
  emailSubject?: string;
  orderReference?: string;
  scheduled?: boolean;
  sendOnDate?: Date | null;
  multipleRecipients?: boolean;
}

export interface Customer {
  name?: string;
  company?: string;
  email?: string;
  address?: string;
  contactable?: boolean;
  firstName?: string;
  lastName?: string;
  title?: string;
  accountName?: string;
  phone?: string;
  mobile?: string;
  source?: string;
  internalCustomerId?: string;
  externalId?: string;
  recipientType?: string;
}

export interface AssociatedCustomer {
  name: string;
  accountName: string;
  title: string;
  email: string;
  mobile: string;
  externalId: string;
  contactable?: boolean
}
export interface TeamMember {
  messages: Message[];
  teamMember: {
    name: string;
    role: string;
    mobile: string;
    email?: string;
    location?: string;
    avatar?: string;
    externalId?: string;
  }
}

export interface SingleTeamMember {
  name: string;
  role: string;
  mobile: string;
  email?: string;
  location?: string;
  avatar?: string;
  externalId?: string;
}
