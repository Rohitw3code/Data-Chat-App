// API configuration
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  PROCESS_URL: '/process_url',
  PROCESS_PDF: '/process_pdf',
  CHAT: '/chat',
  GET_CONTENT: (chatId: string) => `/get_content/${chatId}`,
  CLEAR_DATA: '/clear_data',
} as const;