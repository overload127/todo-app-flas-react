import { AxiosResponse } from 'axios';
import { ITransportContainer } from 'models/response/TransportContainer';
import { ITaskResponse, ITasksPageResponse } from '../models/response/TodoResponse';
import instance from './instances';

export const authAPI = {
  async login(username: string, password: string): Promise<AxiosResponse> {
    return instance.post('/token/auth', {
      username,
      password,
    });
  },
  async refreshAuth(): Promise<AxiosResponse> {
    return instance.post('/token/refresh', {});
  },
  async logout(): Promise<void> {
    return instance.post('/token/logout', {});
  },
};

export const todoAPI = {
  loadPageData(
    page: number,
    sort_by: string,
    is_desc: number,
  ): Promise<AxiosResponse<ITransportContainer<ITasksPageResponse>>> {
    return instance.get<ITransportContainer<ITasksPageResponse>>(
      `/api_v1/tasks?page=${page}&sort_by=${sort_by}&is_desc=${is_desc}`,
      {},
    );
  },
  createTask(
    username: string,
    email: string,
    description: string,
  ): Promise<AxiosResponse<ITransportContainer<ITaskResponse>>> {
    return instance.post<ITransportContainer<ITaskResponse>>('/api_v1/tasks', {
      username,
      description,
      email,
    });
  },
  editTask(id: number, description: string): Promise<AxiosResponse<ITransportContainer<ITaskResponse>>> {
    return instance.put<ITransportContainer<ITaskResponse>>('/api_v1/tasks', {
      id,
      description,
    });
  },
  taskCompleted(id: number): Promise<AxiosResponse<ITransportContainer<ITaskResponse>>> {
    return instance.put<ITransportContainer<ITaskResponse>>('/api_v1/tasks/completed', {
      id,
    });
  },
};
