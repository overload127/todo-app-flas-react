import { NavLink } from 'react-router-dom';

import style from './Page404.module.scss';

function Page404(): JSX.Element {
  return (
    <div className={style.container}>
      <h1 className={style.title}>Страница не найдена. Ошибка 404.</h1>
      <p>
        <NavLink to="/" className={style.backLink}>
          Вернуться на главную
        </NavLink>
      </p>
    </div>
  );
}

export default Page404;
