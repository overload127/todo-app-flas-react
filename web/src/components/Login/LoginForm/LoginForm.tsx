/* eslint-disable react/jsx-props-no-spreading */
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'hooks/redux';
import { loginAuth } from 'store/reducers/auth/ActionCreators';
import style from './LoginForm.module.scss';

type FormValues = {
  login: string;
  password: string;
};

function LoginForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onBlur' });
  const onSubmit = async (data: FormValues) => {
    const status: number = await dispatch(loginAuth(data.login, data.password));
    if (status === 200) {
      navigate('/', { replace: true });
    } else if (status === 401) {
      toast.warn('Неправильный логин или пароль.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } else {
      toast.error('Что-то пошло не так. Попробуйте зайти позже или обратитесь к администратору.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const loginClassName = `${style.input} ${errors.login ? style.validError : ''}`;
  const passwordClassName = `${style.input} ${errors.password ? style.validError : ''}`;

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.wrapperInput}>
        <input
          className={loginClassName}
          id="login"
          {...register('login', {
            required: {
              value: true,
              message: 'Введите login',
            },
            minLength: {
              value: 5,
              message: 'Минимальная длинна для логина 5 символов',
            },
            maxLength: {
              value: 40,
              message: 'Максимальная длинна для логина 40 символов',
            },
          })}
          type="text"
          placeholder="smith"
        />
        <p className={style.tooltip}>{errors && errors.login && errors.login.message}</p>
      </div>

      <div className={style.wrapperInput}>
        <input
          className={passwordClassName}
          id="password"
          {...register('password', {
            required: {
              value: true,
              message: 'Введите пароль',
            },
            minLength: {
              value: 3,
              message: 'Минимальная длинна для пароля 3 символа',
            },
            maxLength: {
              value: 20,
              message: 'Максимальная длинна для пароля 20 символов',
            },
          })}
          type="password"
          placeholder="••••••••••••••••••••"
        />
        <p className={style.tooltip}>{errors && errors.password && errors.password.message}</p>
      </div>

      <div className={style.wrapperButton}>
        <button className={style.button} type="submit">
          ВХОД
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
