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

  return { addCustomer, getCustomers };
};
