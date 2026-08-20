/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnModuleInit } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "../logger/logger";

@Injectable()
export class AxiosService implements OnModuleInit {
  constructor(private logger: Logger) {
    logger.setContext(AxiosService.name);
  }

  onModuleInit() {
    axios.interceptors.request.use((config) => {
      this.logger.debug(config);
      return config;
    });

    axios.interceptors.response.use((response) => {
      this.logger.debug(response);
      return response;
    });
  }

  async get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<AxiosResponse<T, D>> {
    return axios.get<T, AxiosResponse<T, D>, D>(url, config);
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<AxiosResponse<T, D>> {
    return axios.post<T, AxiosResponse<T, D>, D>(url, data, config);
  }
}
