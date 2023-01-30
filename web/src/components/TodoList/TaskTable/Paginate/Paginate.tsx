import { useAppDispatch } from 'hooks/redux';
import { changePage } from 'store/reducers/todo/TodoCreators';
import style from './Paginate.module.scss';

interface IProps {
  currentPage: number;
  taskPerPage: number;
  totalTask: number;
  isFetching: boolean;
}

function Paginate({ currentPage, taskPerPage, totalTask, isFetching }: IProps): JSX.Element {
  const dispatch = useAppDispatch();
  const pageNumbers = [];

  for (let i = 0; i < Math.ceil(totalTask / taskPerPage); i += 1) {
    pageNumbers.push(i);
  }

  const pageNumbersElements = pageNumbers.map((number) => {
    const styleNumber = `${style.pageNumber} ${number === currentPage ? style.currentPage : ''}`;
    const onClick = () => dispatch(changePage(number));
    const labelNumberPage = number + 1;
    const disabledButton = isFetching || number === currentPage;
    return (
      <button key={number} className={styleNumber} onClick={onClick} type="button" disabled={disabledButton}>
        {labelNumberPage}
      </button>
    );
  });

  return (
    <div className={style.container}>
      <ul className="pagination">{pageNumbersElements}</ul>
    </div>
  );
}

export default Paginate;
