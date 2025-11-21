import express from 'express';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth';
import { postsRouter } from './routes/posts';
import { commentsRouter } from './routes/comments';
import { likesRouter } from './routes/likes';
import { trustBoxRouter } from './routes/trustbox';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/trustbox', trustBoxRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
