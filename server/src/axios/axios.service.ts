/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

@Injectable()
export class AxiosService {
  async get(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
    return axios.get(url, config);
  }

  async post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<any, any>> {
    return axios.post(url, data, config);
  }
}
