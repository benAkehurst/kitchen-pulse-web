import { api } from "@/lib/api";
import { SendMessageData } from "@/types/Models";

export const useMessages = () => {
  const getAllMessages = async () => {
    const { data } = await api.get('/message/get-all-messages');
    return data;
  }

  const sendMessage = async (messageData: SendMessageData) => {
    return api.post("/message/send-new-message", messageData);
  };

  const editMessage = async (id: string, newContent: string) => {
    return api.put("/message/edit-message", { id, newContent });
  };

  const deleteMessage = async (id: string) => {
    return api.delete(`/message/delete-message?externalId=${id}`);
  };

  return { getAllMessages, sendMessage, editMessage, deleteMessage };
};
