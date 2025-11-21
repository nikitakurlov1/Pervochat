import { useEffect, useState } from 'react';
import { X, Send, Shield, MessageCircle } from 'lucide-react';
import { trustBoxAPI } from '../api/api';
import './TrustBoxUser.css';

interface TrustBoxUserProps {
  onClose: () => void;
}

export default function TrustBoxUser({ onClose }: TrustBoxUserProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async (silent = false) => {
    try {
      const response = await trustBoxAPI.getMy();
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Автооновлення кожні 3 секунди (silent mode)
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await trustBoxAPI.create(newMessage);
      setNewMessage('');
      setShowForm(false);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="trustbox-overlay" onClick={onClose}>
      <div className="trustbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="trustbox-header">
          <div className="trustbox-title">
            <Shield size={24} />
            <h2>Скарбничка довіри</h2>
          </div>
          <button onClick={onClose} className="btn-close-trustbox">
            <X size={20} />
          </button>
        </div>

        <div className="trustbox-content">
          {loading ? (
            <div className="loading-trustbox">
              <div className="spinner"></div>
              <p>Завантаження...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-trustbox">
              <MessageCircle size={48} />
              <p>У вас поки немає повідомлень</p>
              <p className="empty-subtitle">Напишіть директору анонімно</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className="message-card">
                  <div className="message-bubble user-message">
                    <div className="message-label">Ваше повідомлення</div>
                    <p>{msg.content}</p>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleDateString('uk-UA', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  {msg.isAnswered && msg.reply && (
                    <div className="message-bubble admin-message">
                      <div className="message-label">
                        <Shield size={14} />
                        Відповідь директора
                      </div>
                      <p>{msg.reply}</p>
                      <div className="message-time">
                        {new Date(msg.repliedAt).toLocaleDateString('uk-UA', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  
                  {!msg.isAnswered && (
                    <div className="waiting-reply">
                      <span className="status-badge">Очікує відповіді</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn-new-message">
            <Send size={20} />
            Написати директору
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="message-form">
            <textarea
              placeholder="Напишіть ваше повідомлення директору (анонімно)..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              required
            />
            <div className="form-actions-trustbox">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Скасувати
              </button>
              <button type="submit" disabled={sending} className="btn-send-trustbox">
                {sending ? 'Відправка...' : 'Відправити'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
