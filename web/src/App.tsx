import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector, useAppDispatch } from 'hooks/redux';
import { checkAuth } from 'store/reducers/auth/ActionCreators';
import { initLoadData } from 'store/reducers/todo/TodoCreators';
import TodoList from 'components/TodoList/TodoList';
import Login from 'components/Login/Login';
import Page404 from 'components/Page404/Page404';
import NavBar from 'components/NavBar/NavBar';
import style from './App.module.scss';

function App(): JSX.Element {
  const { isFirstAuth } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(initLoadData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFirstAuth) {
    return <div>Загрузка приложения ...</div>;
  }

  return (
    <div className={style.container}>
      <NavBar />
      <Routes>
        <Route path="todo/*" element={<TodoList />} />
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Navigate to="/todo" replace />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
