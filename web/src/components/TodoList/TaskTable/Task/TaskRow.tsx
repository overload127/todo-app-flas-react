import { ChangeEvent } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { todoSlice } from 'store/reducers/todo/TodoSlice';
import { editTask, taskCompleted } from 'store/reducers/todo/TodoCreators';
import { ITaskResponse } from 'models/response/TodoResponse';
import style from './TaskRow.module.scss';

interface IProps {
  data: ITaskResponse;
  active: boolean;
  isAnonym: boolean;
  isEdited: boolean;
  editDescription: string;
}

function TaskRow({ data, active, isAnonym, isEdited, editDescription }: IProps): JSX.Element {
  const dispatch = useAppDispatch();
  const currentStatusTest = `${data.status === 'RanToCompletion' ? '[Выполнено]' : ''} ${
    data.isAdminEdited ? '[Отредактировано администратором]' : ''
  }`;
  const styleRow = `${style.container} ${active ? style.active : ''}`;

  let actionColumn = null;
  if (!isAnonym) {
    const onEditAction = () => {
      dispatch(
        todoSlice.actions.toggleEdited({
          idEditTask: data.id,
          description: data.description,
        }),
      );
    };
    const offEditAction = () => {
      dispatch(todoSlice.actions.clearEdited());
    };
    const handlerEditTask = () => {
      dispatch(editTask(data.id, editDescription));
    };
    const handlerCompletedTask = () => {
      dispatch(taskCompleted(data.id));
    };
    const disableBtnSuccess = data.status === 'RanToCompletion';
    const buttonSuccess =
      !isEdited && !disableBtnSuccess ? (
        <button type="button" onClick={handlerCompletedTask}>
          Выполнено
        </button>
      ) : null;
    const buttonEdit = !isEdited ? (
      <button type="button" onClick={onEditAction}>
        Отредактировать
      </button>
    ) : null;
    const buttonApply = isEdited ? (
      <button type="button" onClick={handlerEditTask}>
        Применить
      </button>
    ) : null;
    const buttonCancel = isEdited ? (
      <button type="button" onClick={offEditAction}>
        отменить
      </button>
    ) : null;

    actionColumn = (
      <td>
        {buttonSuccess}
        {buttonEdit}
        {buttonApply}
        {buttonCancel}
      </td>
    );
  }

  const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(todoSlice.actions.changeDescription(event.currentTarget.value));
  const descriptionElement = isEdited ? (
    <td>
      <textarea className={style.editDescription} defaultValue={editDescription} onChange={handleChangeDescription} />
    </td>
  ) : (
    <td>{data.description}</td>
  );

  return (
    <tr className={styleRow}>
      <td>{data.username}</td>
      <td>{data.email}</td>
      {descriptionElement}
      <td>{currentStatusTest}</td>
      {actionColumn}
    </tr>
  );
}

export default TaskRow;
