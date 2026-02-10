export enum CodeType {
  PYTHON = 'Python',
  JSON = 'JSON',
  PROMPT = 'Prompt'
}

export interface RepairResult {
  text: string;
  error?: string;
}

export type Language = 'en' | 'vi';

export interface AppError {
  message: string;
  suggestion?: string;
}
