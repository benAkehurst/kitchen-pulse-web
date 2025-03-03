import { api } from "@/lib/api";

export const useOrders = () => {
  const uploadPastOrders = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/orders/upload-past-orders", formData);
  };

  const uploadManualOrder = async (orderData: any) => {
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

  return { uploadPastOrders, uploadManualOrder, getAllOrders, getOrdersByCustomer };
};
