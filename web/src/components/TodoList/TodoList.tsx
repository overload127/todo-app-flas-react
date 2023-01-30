import { useAppSelector } from 'hooks/redux';
import SortForm from './SortForm/SortForm';
import CreateTaskForm from './CreateTaskForm/CreateTaskForm';
import TaskTable from './TaskTable/TaskTable';
import style from './TodoList.module.scss';

function TodoList(): JSX.Element {
  const { isFailed, error } = useAppSelector((state) => state.todoReducer.data);
  if (isFailed) return <p>{error}</p>;

  return (
    <div className={style.container}>
      <div className={style.controlBlock}>
        <CreateTaskForm />
        <SortForm />
      </div>
      <TaskTable />
    </div>
  );
}

export default TodoList;
