import { MouseEvent } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks/redux';
import { changeSortDesc, changeSortType } from 'store/reducers/todo/TodoCreators';
import { ALL_SORT_TYPE, ISortType } from 'models/response/TodoResponse';
import style from './SortForm.module.scss';

function SortForm(): JSX.Element {
  const { sortBy, isDesc } = useAppSelector((state) => state.todoReducer.parameters);
  const dispatch = useAppDispatch();

  const sortByType = (event: MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (ALL_SORT_TYPE.includes(target.value) && sortBy !== target.value) {
      dispatch(changeSortType(target.value as ISortType));
    }
  };

  const sortByDesc = (event: MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const newDesc = target.value === 'isDesc';
    if (newDesc !== isDesc) {
      dispatch(changeSortDesc(newDesc));
    }
  };

  const selectUsername = sortBy === 'username';
  const selectEmail = sortBy === 'email';
  const selectStatus = sortBy === 'status';

  return (
    <div className={style.container}>
      <h2>Режимы сортировки</h2>

      <div className={style.section}>
        <label className={style.fieldContainer} htmlFor="notDesc">
          Сортировка по возрастанию
          <div className={style.wrapperToggleButton}>
            <input
              className={style.toggleButton}
              onClick={sortByDesc}
              value="notDesc"
              id="notDesc"
              name="sortDesc"
              type="radio"
              defaultChecked={!isDesc}
            />
          </div>
        </label>

        <label className={style.fieldContainer} htmlFor="isDesc">
          Сортировка по убыванию
          <div className={style.wrapperToggleButton}>
            <input
              className={style.toggleButton}
              onClick={sortByDesc}
              value="isDesc"
              id="isDesc"
              name="sortDesc"
              type="radio"
              defaultChecked={isDesc}
            />
          </div>
        </label>
      </div>

      <div className={style.section}>
        <label className={style.fieldContainer} htmlFor="username">
          Сортировка по имени пользователя
          <div className={style.wrapperToggleButton}>
            <input
              className={style.toggleButton}
              onClick={sortByType}
              value="username"
              id="username"
              name="sortType"
              type="radio"
              defaultChecked={selectUsername}
            />
          </div>
        </label>

        <label className={style.fieldContainer} htmlFor="email">
          Сортировка по e-mail
          <div className={style.wrapperToggleButton}>
            <input
              className={style.toggleButton}
              onClick={sortByType}
              value="email"
              id="email"
              name="sortType"
              type="radio"
              defaultChecked={selectEmail}
            />
          </div>
        </label>

        <label className={style.fieldContainer} htmlFor="status">
          Сортировка по статусу задачи
          <div className={style.wrapperToggleButton}>
            <input
              className={style.toggleButton}
              onClick={sortByType}
              value="status"
              id="status"
              name="sortType"
              type="radio"
              defaultChecked={selectStatus}
            />
          </div>
        </label>
      </div>
    </div>
  );
}

export default SortForm;
