export function createResponse(
  status: number,
  message: string,
  data?: any,
  error?: string
) {
  return {
    status: status,
    data: data || null,
    message: message,
    error: error || null,
  };
}
