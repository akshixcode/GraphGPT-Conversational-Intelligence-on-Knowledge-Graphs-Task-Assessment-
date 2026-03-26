import type { Edge } from "reactflow";

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface QueryResponse {
  answer: string;
  nodes?: Node[];
  edges?: Edge[];
}