import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'hooks/redux';
import { logoutAuth } from 'store/reducers/auth/ActionCreators';
import style from './NavBar.module.scss';

interface IStyleProps {
  isActive: boolean;
}

const selectStyle = ({ isActive }: IStyleProps): string =>
  isActive ? `${style.link} ${style.active}` : `${style.link}`;

function NavBar(): JSX.Element {
  const { isAnonym } = useAppSelector((state) => state.authReducer.user);
  const dispatch = useAppDispatch();
  const onClickLogout = () => dispatch(logoutAuth());

  const buttonAction = isAnonym ? (
    <NavLink className={selectStyle} to="/login">
      Вход
    </NavLink>
  ) : (
    <button className={style.link} onClick={onClickLogout} type="button">
      Выход
    </button>
  );

  return (
    <nav className={style.container}>
      <NavLink className={selectStyle} to="/">
        Todo
      </NavLink>
      {buttonAction}
    </nav>
  );
}

export default NavBar;
