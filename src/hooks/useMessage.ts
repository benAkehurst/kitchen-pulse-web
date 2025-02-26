import { api } from "@/lib/api";

export const useMessages = () => {
  const sendMessage = async (content: string, customerId: string) => {
    return api.post("/message/send-new-message", { content, customerId });
  };

  const editMessage = async (id: string, newContent: string) => {
    return api.put("/message/edit-message", { id, newContent });
  };

  const deleteMessage = async (id: string) => {
    return api.delete(`/message/delete-message/${id}`);
  };

  return { sendMessage, editMessage, deleteMessage };
};
