export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  ...(data && { data }),
});

export const errorResponse = (message: string, errors?: any[]): ApiResponse => ({
  success: false,
  message,
  ...(errors && { errors }),
});
