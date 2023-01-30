import LoginForm from './LoginForm/LoginForm';
import style from './Login.module.scss';

function Login(): JSX.Element {
  return (
    <div className={style.container}>
      <LoginForm />
    </div>
  );
}

export default Login;
