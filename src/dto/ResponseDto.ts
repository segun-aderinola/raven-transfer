import { ApiResponse } from '@/types';

export class ResponseDto<T = any> implements ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public error?: string | null;
  public timestamp: string;

  constructor(success: boolean, message: string, data?: T, error?: string | null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  public static success<T>(message: string, data?: T): ResponseDto<T> {
    return new ResponseDto<T>(true, message, data);
  }

  public static error(message: string, error?: string | null): ResponseDto {
    return new ResponseDto(false, message, undefined, error);
  }
}