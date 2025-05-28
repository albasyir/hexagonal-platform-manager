export interface HttpPlatformRequest {
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: any;
  headers: Record<string, string>;
} 