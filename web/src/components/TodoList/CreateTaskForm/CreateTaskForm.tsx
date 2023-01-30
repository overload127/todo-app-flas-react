/* eslint-disable react/jsx-props-no-spreading */
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from 'hooks/redux';
import { createTask } from 'store/reducers/todo/TodoCreators';
import style from './CreateTaskForm.module.scss';

type FormValues = {
  username: string;
  email: string;
  description: string;
};

function CreateTaskForm(): JSX.Element {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onBlur' });

  const onSubmit = async ({ username, email, description }: FormValues) => {
    const status: number = await dispatch(createTask(username, email, description));
    if (status === 200) {
      toast.success('Новая задача создана.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } else {
      toast.error('Возникла ошибка при работе приложения. Попробуйте позже.', {
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

  const usernameClassName = `${style.input} ${errors.username ? style.validError : ''}`;
  const emailClassName = `${style.input} ${errors.email ? style.validError : ''}`;
  const descriptionClassName = `${style.textarea} ${errors.description ? style.validError : ''}`;

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать новую задачу</h2>

      <div className={style.wrapperInput}>
        <label className={style.fieldContainer} htmlFor="username">
          Имя пользователя
          <input
            className={usernameClassName}
            id="username"
            {...register('username', {
              required: {
                value: true,
                message: 'Введите имя пользователя',
              },
              minLength: {
                value: 4,
                message: 'Минимальная длинна 4 символов',
              },
              maxLength: {
                value: 50,
                message: 'Максимальная длинна 50 символов',
              },
            })}
            type="text"
            placeholder="smith"
          />
        </label>
        <p className={style.tooltip}>{errors && errors.username && errors.username.message}</p>
      </div>

      <div className={style.wrapperInput}>
        <label className={style.fieldContainer} htmlFor="email">
          E-mail
          <input
            className={emailClassName}
            id="email"
            {...register('email', {
              required: {
                value: true,
                message: 'Введите email',
              },
              minLength: {
                value: 4,
                message: 'Минимальная длинна 4 символов',
              },
              maxLength: {
                value: 50,
                message: 'Максимальная длинна 50 символов',
              },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Введите правильную почту (Пример: primer@gmail.com)',
              },
            })}
            type="text"
            placeholder="primer@gmail.com"
          />
        </label>
        <p className={style.tooltip}>{errors && errors.email && errors.email.message}</p>
      </div>

      <div className={style.wrapperTextarea}>
        <textarea
          className={descriptionClassName}
          id="description"
          {...register('description', {
            required: {
              value: true,
              message: 'Введите Ваше описание задачи',
            },
            minLength: {
              value: 5,
              message: 'Минимальная длинна для задачи 5 символов',
            },
            maxLength: {
              value: 500,
              message: 'Максимальная длинна для задачи 500 символов',
            },
          })}
          placeholder="Описание Вашей задачи"
        />
        <p className={style.tooltip}>{errors && errors.description && errors.description.message}</p>
      </div>

      <button className={style.button} type="submit">
        Добавить задачу в список
      </button>
    </form>
  );
}

export default CreateTaskForm;
