import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { login } from '../services/auth';

type LoginPageProps = {
  onSuccess: () => void;
};

function LoginPage({ onSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(username, password);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('账号或密码错误');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell
      title="透视分析"
      description="使用演示账号登录后，选择一个数据源进入透视分析流程。"
    >
      <form onSubmit={handleSubmit} aria-label="登录表单">
        <div>
          <label htmlFor="username">账号</label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
    </AppShell>
  );
}

export default LoginPage;
