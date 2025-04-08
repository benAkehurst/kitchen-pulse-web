import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLanding = () => {
  const queryClient = useQueryClient();

  const sendSupportRequest = useMutation({
    mutationFn: async ({ userName, email, company, message }: { userName: string, email: string, company: string, message: string }) =>
      api.post("/landing-page/support", {
        userName,
        email,
        company,
        message,
      }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support"] })
  });

  return {
    sendSupportRequest
  }

};
