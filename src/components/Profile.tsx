import { useEffect, useState } from 'react';
import { LogOut, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { postsAPI } from '../api/api';
import PostCard from './PostCard';
import TrustBoxUser from './TrustBoxUser';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [showTrustBox, setShowTrustBox] = useState(false);

  const fetchUserPosts = async (silent = false) => {
    if (!user) return;
    try {
      const response = await postsAPI.getUserPosts(user.id);
      setPosts(response.data);
    } catch (error) {
      if (!silent) {
        console.error('Failed to fetch user posts', error);
      }
    }
  };

  useEffect(() => {
    fetchUserPosts();
    
    // Автооновлення кожні 5 секунд (silent mode)
    const interval = setInterval(() => {
      fetchUserPosts(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

  // Вычисляем дату регистрации (примерно)
  const memberSince = new Date().toLocaleDateString('uk-UA', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-meta">
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            З {memberSince}
          </p>
        </div>
        <button onClick={logout} className="btn-logout">
          <LogOut size={16} />
          Вийти
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{posts.length}</div>
          <div className="stat-label">Постів</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalLikes}</div>
          <div className="stat-label">Лайків</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalComments}</div>
          <div className="stat-label">Коментарів</div>
        </div>
      </div>

      <button onClick={() => setShowTrustBox(true)} className="btn-trustbox">
        <Shield size={20} />
        Скарбничка довіри
      </button>

      <h3 className="profile-section-title">Мої пости</h3>
      {posts.length === 0 ? (
        <p className="empty">У вас поки немає постів. Створіть перший!</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCommentClick={() => {}}
            onUpdate={fetchUserPosts}
          />
        ))
      )}

      {showTrustBox && <TrustBoxUser onClose={() => setShowTrustBox(false)} />}
    </div>
  );
}
