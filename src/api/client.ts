import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './config';
import type { URLRequest, ChatRequest, ProcessResponse, ChatResponse } from './types';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentApi = {
  async processUrl(url: string): Promise<ProcessResponse> {
    const response = await apiClient.post<ProcessResponse>(
      API_ENDPOINTS.PROCESS_URL,
      { url }
    );
    return response.data;
  },

  async processPdf(file: File): Promise<ProcessResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ProcessResponse>(
      API_ENDPOINTS.PROCESS_PDF,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async chat(chatId: string, question: string): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(
      API_ENDPOINTS.CHAT,
      { chat_id: chatId, question }
    );
    return response.data;
  },

  async getContent(chatId: string): Promise<ContentResponse> {
    const response = await apiClient.get<ContentResponse>(
      API_ENDPOINTS.GET_CONTENT(chatId)
    );
    return response.data;
  },

  async clearData(): Promise<{ message: string }> {
    const response = await apiClient.delete(API_ENDPOINTS.CLEAR_DATA);
    return response.data;
  },
};