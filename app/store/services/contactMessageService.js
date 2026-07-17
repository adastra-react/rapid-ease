import api from "./api";
import { apiCall } from "@/app/lib/auth";

const contactMessageService = {
  createMessage: async (payload) => {
    const response = await api.post("/contact-messages", payload);
    return response.data;
  },

  getAllMessages: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/contact-messages${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  updateMessage: async (id, payload) => {
    return apiCall(`/contact-messages/${id}`, {
      method: "PATCH",
      data: payload,
    });
  },

  deleteMessage: async (id) => {
    return apiCall(`/contact-messages/${id}`, {
      method: "DELETE",
    });
  },
};

export default contactMessageService;
