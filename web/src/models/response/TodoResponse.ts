export interface ITaskResponse {
  id: number;
  username: string;
  email: string;
  description: string;
  status: 'Running' | 'RanToCompletion';
  isAdminEdited: boolean;
}

export const ALL_SORT_TYPE = ['username', 'status', 'email'];
export type ISortType = 'username' | 'status' | 'email';

export interface ITasksPageResponse {
  task_per_page: number;
  current_page: number;
  sort_by: ISortType;
  is_desc: number;
  total_task: number;
  data: ITaskResponse[];
}
