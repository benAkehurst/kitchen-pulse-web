import { api } from "@/lib/api";
import { Customer } from "@/types/Models";

export const useCustomer = () => {
  const addCustomer = async (customerData: Customer) => {
    return api.post("/customer/add-customer", customerData);
  };

  const getCustomers = async () => {
    const { data } = await api.get("/customer/get-customers");
    return data;
  };

  const getSingleCustomer = async (id: string) => {
    const { data } = await api.get(`/customer/single-customer?externalId=${id}`);
    return data;
  }

  const updateSingleCustomer = async (customerData: Customer) => {
    return api.put(`/customer/update-customer?externalId=${customerData.externalId}`, customerData)
  }

  return { addCustomer, getCustomers, getSingleCustomer, updateSingleCustomer };
};
