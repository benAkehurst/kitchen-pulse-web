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
