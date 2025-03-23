import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Customer } from "@/types/Models";

export const useCustomer = () => {
  const queryClient = useQueryClient();

  const { data: customers, ...customersQuery } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await api.get("/customer/get-customers");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: singleCustomer, mutate: fetchSingleCustomer } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.get(`/customer/single-customer?externalId=${id}`);
      return data;
    },
  });

  const addCustomer = useMutation({
    mutationFn: async (customerData: Customer) => api.post("/customer/add-customer", customerData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const updateSingleCustomer = useMutation({
    mutationFn: async (customerData: Customer) =>
      api.put(`/customer/update-customer?externalId=${customerData.externalId}`, customerData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.setQueryData(["singleCustomer", variables.externalId], variables);
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => api.delete(`/customer/delete-customer?externalId=${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  return {
    customers,
    customersQuery,
    singleCustomer,
    fetchSingleCustomer,
    addCustomer,
    updateSingleCustomer,
    deleteCustomer
  };
};
