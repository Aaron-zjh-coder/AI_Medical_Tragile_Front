export interface ResultVO<T = unknown> {
  code: string;
  message: string;
  data: T | null;
  timestamp: number;
}
