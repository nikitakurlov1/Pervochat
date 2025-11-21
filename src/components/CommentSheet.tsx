import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { commentsAPI } from '../api/api';
import './CommentSheet.css';

interface CommentSheetProps {
  post: any;
  onClose: () => void;
  onCommentAdded: () => void;
}

export default function CommentSheet({ post, onClose, onCommentAdded }: CommentSheetProps) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await commentsAPI.create(post.id, text);
      setText('');
      onCommentAdded();
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  return (
    <div className="comment-sheet-overlay" onClick={onClose}>
      <div className="comment-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="comment-sheet-header">
          <h3>Коментарі</h3>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>
        <div className="comments-list">
          {post.comments.length === 0 ? (
            <p className="no-comments">Поки немає коментарів. Будьте першим!</p>
          ) : (
            post.comments.map((comment: any) => (
              <div key={comment.id} className="comment">
                <div className="comment-author">{comment.user.username}</div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Написати коментар..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn-send">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
