import { useAppSelector } from 'hooks/redux';
import TaskRow from './Task/TaskRow';
import Paginate from './Paginate/Paginate';
import style from './TaskTable.module.scss';

function TodoList(): JSX.Element {
  const { isAnonym } = useAppSelector((state) => state.authReducer.user);
  const { isFetching, isFailed, error, objectData } = useAppSelector((state) => state.todoReducer.data);
  const { currentPage, taskPerPage, totalTask } = useAppSelector((state) => state.todoReducer.parameters);
  const { idEditTask, description } = useAppSelector((state) => state.todoReducer.action);

  if (isFailed) return <p>{error}</p>;

  const tasks = objectData.map((task, index) => {
    const active = index % 2 === 0;
    const isEdited = idEditTask === task.id;
    const editDescription = isEdited ? description : '';
    return (
      <TaskRow
        key={task.id}
        data={task}
        active={active}
        isAnonym={isAnonym}
        isEdited={isEdited}
        editDescription={editDescription}
      />
    );
  });

  const actionColumn = isAnonym ? '' : <th>Действия</th>;

  return (
    <div className={style.container}>
      <table className={style.table}>
        <thead className={style.header}>
          <tr>
            <th>Имя пользователя</th>
            <th>е-mail</th>
            <th>Текст задачи</th>
            <th>Статус задачи</th>
            {actionColumn}
          </tr>
        </thead>
        <tbody>{tasks}</tbody>
      </table>

      <Paginate currentPage={currentPage} taskPerPage={taskPerPage} totalTask={totalTask} isFetching={isFetching} />
    </div>
  );
}

export default TodoList;
