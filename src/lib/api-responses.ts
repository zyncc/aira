export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: number;
  type?: string;
  details?: string;
}

export function SuccessResponse<T>(message = "Success", data?: T): ApiResponse<T> {
  return { success: true, message, data };
}

export function ErrorResponse(message: string, error?: ApiError): ApiResponse<null> {
  return { success: false, message, error };
}

export function AuthErrorResponse(message = "Authentication failed"): ApiResponse<null> {
  return {
    success: false,
    message,
    error: { code: 401, type: "Authentication" },
  };
}

export function AuthorizationErrorResponse(message = "Unauthorized"): ApiResponse<null> {
  return {
    success: false,
    message,
    error: { code: 403, type: "Unauthorized" },
  };
}
