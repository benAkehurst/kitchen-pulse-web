import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types/Models";

export const useUser = () => {
  const queryClient = useQueryClient();

  const { data: user, ...userQuery } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/user/get-profile-information");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateProfile = useMutation({
    mutationFn: async (userData: User) => api.put("/user/update-profile", userData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.put("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  return {
    user,
    userQuery,
    updateProfile,
    uploadAvatar,
  };
};
