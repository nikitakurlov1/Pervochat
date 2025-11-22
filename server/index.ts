import express from 'express';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth';
import { postsRouter } from './routes/posts';
import { commentsRouter } from './routes/comments';
import { likesRouter } from './routes/likes';
import { trustBoxRouter } from './routes/trustbox';

async function main() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));

  // API routes
  app.use('/api/auth', authRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/likes', likesRouter);
  app.use('/api/trustbox', trustBoxRouter);

  if (!isProd) {
    // In development use Vite's middleware so frontend and backend are served from the same origin (port 3000)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: 'html' },
      appType: 'custom'
    } as any);
    app.use(vite.middlewares);

    app.listen(PORT, () => {
      console.log(`Dev server (Express + Vite) running on http://localhost:${PORT}`);
    });
  } else {
    // In production serve static files from `dist`
    const distPath = path.resolve(__dirname, '..', 'dist');
    app.use(express.static(distPath));

    // Serve index.html for SPA routes
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server running in production mode on http://localhost:${PORT}`);
    });
  }
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
