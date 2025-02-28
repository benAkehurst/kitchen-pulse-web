import { api } from "@/lib/api";
import { User } from "@/types/Models";

export const useUser = () => {
  const getUserInformation = async () => {
    const { data } = await api.get("/user/get-profile-information");
    return data;
  };

  const updateProfile = async (userData: User) => {
    return api.put("/user/update-profile", userData);
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put("/user/upload-avatar", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };



  return { getUserInformation, updateProfile, uploadAvatar };
};
