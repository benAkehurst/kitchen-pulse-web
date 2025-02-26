import { api } from "@/lib/api";

export const useUser = () => {
  const updateProfile = async (userData: any) => {
    return api.put("/user/update-profile", userData);
  };

  const addCustomer = async (customerData: any) => {
    return api.post("/user/add-customer", customerData);
  };

  const getCustomers = async () => {
    const { data } = await api.get("/user/get-customers");
    return data;
  };

  return { updateProfile, addCustomer, getCustomers };
};
