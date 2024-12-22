// API types
export interface URLRequest {
  url: string;
}

export interface ChatRequest {
  chat_id: string;
  question: string;
}

export interface ProcessResponse {
  chat_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface ContentResponse {
  chat_id: string;
  content: string;
}

export interface ErrorResponse {
  detail: string;
}