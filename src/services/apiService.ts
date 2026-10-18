import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export class ApiService {
  protected http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Chỉ reject về mã lỗi (HTTP status code number hoặc code string như ECONNABORTED)
        const errorCode: number | string = error.response?.status || error.code || 'UNKNOWN_ERROR';
        return Promise.reject(errorCode);
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  protected async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }
}
