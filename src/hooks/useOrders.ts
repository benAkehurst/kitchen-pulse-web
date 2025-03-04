import { api } from "@/lib/api";
import { ManualOrder, UpdatingOrder } from "@/types/Models";

export const useOrders = () => {
  const uploadPastOrders = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/orders/upload-past-orders", formData);
  };

  const uploadManualOrder = async (orderData: ManualOrder) => {
    return api.post("/orders/upload-manual-order", orderData);
  };

  const getAllOrders = async () => {
    const { data } = await api.get("/orders/all-orders");
    return data;
  };

  const getOrdersByCustomer = async (customerId: string) => {
    const { data } = await api.get(`/orders/orders-by-customer?externalId=${customerId}`);
    return data;
  };

  const getSingleOrder = async (orderId: string) => {
    const { data } = await api.get(`/orders/get-single-order?externalId=${orderId}`);
    return data;
  }

  const updateSingleOrder = async (externalId: string, orderData: UpdatingOrder) => {
    return api.put(`/orders/update-single-order?externalId=${externalId}`, orderData)
  }

  return { uploadPastOrders, uploadManualOrder, getAllOrders, getOrdersByCustomer, getSingleOrder, updateSingleOrder };
};
