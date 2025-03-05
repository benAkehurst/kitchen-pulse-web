import { api } from "@/lib/api";
import { EditMessage, SendMessageData } from "@/types/Models";

export const useMessages = () => {
  const getAllMessages = async () => {
    const { data } = await api.get('/message/get-all-messages');
    return data;
  }

  const getSingleMessage = async (externalId: string) => {
    const { data } = await api.get(`/message/get-single-message?externalId=${externalId}`)
    return data;
  }

  const sendMessage = async (messageData: SendMessageData) => {
    return api.post("/message/send-new-message", messageData);
  };

  const editMessage = async (externalId: string, newContent: EditMessage) => {
    return api.put(`/message/edit-message?externalId=${externalId}`, newContent);
  };

  const deleteMessage = async (id: string) => {
    return api.delete(`/message/delete-message?externalId=${id}`);
  };

  return { getAllMessages, getSingleMessage, sendMessage, editMessage, deleteMessage };
};
