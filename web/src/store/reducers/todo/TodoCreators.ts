import { AppDispatch, RootState } from 'store/store';
import { todoAPI } from 'api/api';
import { ISortType, ITaskResponse } from 'models/response/TodoResponse';
import { IParameters, todoSlice } from './TodoSlice';

export const loadData = (page: number, sortBy: ISortType, isDesc: boolean) => async (dispatch: AppDispatch) => {
  dispatch(todoSlice.actions.startFetching());
  try {
    const result = await todoAPI.loadPageData(page, sortBy, Number(isDesc));
    const tasks: ITaskResponse[] = result.data.payload.data.map((item) => ({ ...item }));
    dispatch(todoSlice.actions.loadSuccess(tasks));
    const parameters: IParameters = {
      currentPage: result.data.payload.current_page,
      taskPerPage: result.data.payload.task_per_page,
      sortBy: result.data.payload.sort_by,
      isDesc: Boolean(result.data.payload.is_desc),
      totalTask: result.data.payload.total_task,
    };
    dispatch(todoSlice.actions.setParameters(parameters));
  } catch (e) {
    console.error(e.response?.data?.message);
    console.error(e.message);
    dispatch(todoSlice.actions.loadError(e.message));
  }
};

export const initLoadData = () => async (dispatch: AppDispatch, getStore: () => RootState) => {
  const { currentPage, sortBy, isDesc } = getStore().todoReducer.parameters;
  await dispatch(loadData(currentPage, sortBy, isDesc));
  await dispatch(todoSlice.actions.init());
};

export const changePage = (page: number) => async (dispatch: AppDispatch, getStore: () => RootState) => {
  const { sortBy, isDesc } = getStore().todoReducer.parameters;
  await dispatch(loadData(page, sortBy, isDesc));
};

export const changeSortType = (sortBy: ISortType) => async (dispatch: AppDispatch, getStore: () => RootState) => {
  const { currentPage, isDesc } = getStore().todoReducer.parameters;
  await dispatch(loadData(currentPage, sortBy, isDesc));
};

export const changeSortDesc = (isDesc: boolean) => async (dispatch: AppDispatch, getStore: () => RootState) => {
  const { currentPage, sortBy } = getStore().todoReducer.parameters;
  await dispatch(loadData(currentPage, sortBy, isDesc));
};

export const createTask =
  (username: string, email: string, description: string) =>
  async (dispatch: AppDispatch, getStore: () => RootState) => {
    dispatch(todoSlice.actions.startFetching());
    try {
      const result = await todoAPI.createTask(username, email, description);
      const { objectData: tasks } = getStore().todoReducer.data;
      const { totalTask } = getStore().todoReducer.parameters;
      if (totalTask < 3) {
        await dispatch(todoSlice.actions.loadSuccess([...tasks, result.data.payload]));
      } else {
        await dispatch(todoSlice.actions.loadSuccess(tasks));
      }
      await dispatch(todoSlice.actions.updateTotalTask(totalTask + 1));
      return result.status;
    } catch (e) {
      dispatch(todoSlice.actions.loadError(e.message));
      return e.response?.status;
    }
  };

export const updateTaskLocal =
  (newTaskData: ITaskResponse) => async (dispatch: AppDispatch, getStore: () => RootState) => {
    const { objectData: tasks } = getStore().todoReducer.data;
    const newTasks = tasks.map((task) => {
      if (task.id === newTaskData.id) {
        return newTaskData;
      }
      return task;
    });
    await dispatch(todoSlice.actions.loadSuccess(newTasks));
  };

export const editTask = (idTask: number, description: string) => async (dispatch: AppDispatch) => {
  dispatch(todoSlice.actions.startFetching());
  try {
    const result = await todoAPI.editTask(idTask, description);
    await dispatch(todoSlice.actions.clearEdited());
    await dispatch(updateTaskLocal(result.data.payload));
    return result.status;
  } catch (e) {
    if (e.response?.status !== 401) dispatch(todoSlice.actions.loadError(e.message));
    return e.response?.status;
  }
};

export const taskCompleted = (idTask: number) => async (dispatch: AppDispatch) => {
  dispatch(todoSlice.actions.startFetching());
  try {
    const result = await todoAPI.taskCompleted(idTask);
    await dispatch(updateTaskLocal(result.data.payload));
    return result.status;
  } catch (e) {
    if (e.response?.status !== 401) dispatch(todoSlice.actions.loadError(e.message));
    return e.response?.status;
  }
};

export default null;
