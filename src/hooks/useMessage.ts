import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EditMessage, SendMessageData } from "@/types/Models";

export const useMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, ...messagesQuery } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await api.get("/message/get-all-messages");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: fetchSingleMessage, data: singleMessage } = useMutation({
    mutationFn: async (externalId: string) => {
      const { data } = await api.get(`/message/get-single-message?externalId=${externalId}`);
      return data;
    },
  });

  const { mutate: fetchCustomerMessages, data: customerMessages } = useMutation({
    mutationFn: async (externalId: string) => {
      const { data } = await api.get(`/message/get-messages-customer?externalId=${externalId}`);
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (messageData: SendMessageData) =>
      api.post("/message/send-new-message", messageData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const editMessage = useMutation({
    mutationFn: async ({ externalId, newContent }: { externalId: string; newContent: EditMessage }) =>
      api.put(`/message/edit-message?externalId=${externalId}`, newContent),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => api.delete(`/message/delete-message?externalId=${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  return {
    messages,
    messagesQuery,
    fetchSingleMessage,
    singleMessage,
    fetchCustomerMessages,
    customerMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
};
