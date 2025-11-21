import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../api/api';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = isLogin
        ? await authAPI.login(email, password)
        : await authAPI.register(email, username, password);
      
      setAuth(response.data.token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Помилка автентифікації');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>School Messenger</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Увійдіть у свій акаунт' : 'Створіть новий акаунт'}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email або логін"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Ім'я користувача"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-primary">
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
          {isLogin ? 'Немає акаунту? Зареєструйтесь' : 'Вже є акаунт? Увійдіть'}
        </button>
      </div>
    </div>
  );
}
