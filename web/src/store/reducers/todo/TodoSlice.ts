import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISortType, ITaskResponse } from 'models/response/TodoResponse';

interface IWorkNet<T> {
  isFetching: boolean;
  isFailed: boolean;
  error: string;
  objectData: T;
}

export interface IParameters {
  currentPage: number;
  taskPerPage: number;
  sortBy: ISortType;
  isDesc: boolean;
  totalTask: number;
}

export interface IAction {
  idEditTask: number | null;
  description: string;
}

interface ITaskState {
  isInit: boolean;
  parameters: IParameters;
  data: IWorkNet<ITaskResponse[]>;
  action: IAction;
}

const initialState: ITaskState = {
  isInit: false,
  parameters: {
    currentPage: 0,
    taskPerPage: 0,
    sortBy: 'username',
    isDesc: true,
    totalTask: 0,
  },
  data: {
    isFetching: false,
    isFailed: false,
    error: '',
    objectData: [],
  },
  action: {
    idEditTask: null,
    description: '',
  },
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    init(state) {
      state.isInit = true;
    },
    startFetching(state) {
      state.data.isFetching = true;
    },
    loadSuccess(state, action: PayloadAction<ITaskResponse[]>) {
      state.data.isFailed = false;
      state.data.error = '';
      state.data.isFetching = false;
      state.data.objectData = action.payload;
    },
    loadError(state, action: PayloadAction<string>) {
      state.data.isFetching = false;
      state.data.isFailed = true;
      state.data.error = action.payload;
    },
    setParameters(state, action: PayloadAction<IParameters>) {
      state.parameters = action.payload;
    },
    toggleEdited(state, action: PayloadAction<IAction>) {
      state.action = action.payload;
    },
    changeDescription(state, action: PayloadAction<string>) {
      state.action.description = action.payload;
    },
    clearEdited(state) {
      state.action = { idEditTask: null, description: '' };
    },
    updateTotalTask(state, action: PayloadAction<number>) {
      state.parameters.totalTask = action.payload;
    },
  },
});

export default todoSlice.reducer;
