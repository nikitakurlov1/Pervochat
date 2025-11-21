import { useEffect, useState } from 'react';
import { Shield, LogOut, Trash2, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { postsAPI, commentsAPI } from '../api/api';
import TrustBoxAdmin from './TrustBoxAdmin';
import './AdminPanel.css';

export default function AdminPanel() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'trustbox'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });

  const fetchPosts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
      
      // Вычисляем статистику
      const totalComments = response.data.reduce((sum: number, post: any) => sum + post.comments.length, 0);
      const totalLikes = response.data.reduce((sum: number, post: any) => sum + post.likes.length, 0);
      
      setStats({
        totalPosts: response.data.length,
        totalComments,
        totalLikes
      });
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Автооновлення кожні 5 секунд (silent mode)
    const interval = setInterval(() => {
      if (activeTab === 'posts') {
        fetchPosts(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Видалити цей пост?')) {
      try {
        await postsAPI.delete(postId);
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Видалити цей коментар?')) {
      try {
        await commentsAPI.delete(commentId);
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete comment', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">
          <Shield size={24} />
          <div>
            <h1>Адмін-панель</h1>
            <p className="admin-subtitle">Вітаємо, {user?.username}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-logout-admin">
          <LogOut size={18} />
          Вийти
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <Trash2 size={18} />
          Пости
        </button>
        <button 
          className={`admin-tab ${activeTab === 'trustbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('trustbox')}
        >
          <MessageCircle size={18} />
          Повідомлення
        </button>
      </div>

      {activeTab === 'trustbox' ? (
        <TrustBoxAdmin />
      ) : (
        <>
          <div className="admin-stats">
        <div className="stat-card-admin">
          <div className="stat-value">{stats.totalPosts}</div>
          <div className="stat-label">Постів</div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-value">{stats.totalComments}</div>
          <div className="stat-label">Коментарів</div>
        </div>
        <div className="stat-card-admin">
          <div className="stat-value">{stats.totalLikes}</div>
          <div className="stat-label">Лайків</div>
        </div>
      </div>

      <div className="admin-content">
        <h2 className="section-title">Усі пости</h2>
        {posts.length === 0 ? (
          <p className="empty">Немає постів</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="admin-post-card">
              <div className="post-header-admin">
                <div className="post-author-info">
                  <div className="post-author-avatar">
                    {post.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="post-author">{post.user.username}</div>
                    <div className="post-category">{post.category}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePost(post.id)} 
                  className="btn-delete-admin"
                  title="Видалити пост"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <p className="post-text">{post.text}</p>
              
              {post.imageUrl && (
                <img src={post.imageUrl} alt="Post" className="post-image" />
              )}

              {post.poll && (
                <div className="poll-admin">
                  <p className="poll-question">{post.poll.question}</p>
                  {post.poll.options.map((option: any) => (
                    <div key={option.id} className="poll-option-admin">
                      {option.text} - {option.votes} голосів
                    </div>
                  ))}
                </div>
              )}

              <div className="post-meta">
                <span>❤️ {post.likes.length}</span>
                <span>💬 {post.comments.length}</span>
              </div>

              {post.comments.length > 0 && (
                <div className="comments-section">
                  <h4>Коментарі:</h4>
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="comment-admin">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user.username}:</span>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-delete-comment"
                          title="Видалити коментар"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
}
