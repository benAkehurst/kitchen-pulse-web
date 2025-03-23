import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ManualOrder, UpdatingOrder } from "@/types/Models";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/all-orders");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: fetchOrdersByCustomer, data: customerOrders } = useMutation({
    mutationFn: async (customerId: string) => {
      const { data } = await api.get(`/orders/orders-by-customer?externalId=${customerId}`);
      return data;
    },
  });

  const { mutate: fetchSingleOrder, data: singleOrder } = useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.get(`/orders/get-single-order?externalId=${orderId}`);
      return data;
    },
  });

  const uploadPastOrders = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/orders/upload-past-orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const uploadManualOrder = useMutation({
    mutationFn: async (orderData: ManualOrder) => api.post("/orders/upload-manual-order", orderData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const updateSingleOrder = useMutation({
    mutationFn: async ({ externalId, orderData }: { externalId: string; orderData: UpdatingOrder }) =>
      api.put(`/orders/update-single-order?externalId=${externalId}`, orderData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => api.delete(`/orders/delete-order?externalId=${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  return {
    orders,
    ordersQuery,
    customerOrders,
    fetchOrdersByCustomer,
    singleOrder,
    fetchSingleOrder,
    uploadPastOrders,
    uploadManualOrder,
    updateSingleOrder,
    deleteOrder
  };
};
