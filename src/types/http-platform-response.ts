export interface HttpPlatformResponse {
  status(code: number): void;
  json(data: any): void;
  send(data: any): void;
} 