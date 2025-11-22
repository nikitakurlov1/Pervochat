import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'file' ? 'uploads/files/' : 'uploads/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, username: true } },
        likes: true,
        comments: { include: { user: { select: { username: true } } } },
        poll: { include: { options: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/user/:userId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, username: true } },
        likes: true,
        comments: true,
        poll: { include: { options: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

router.post('/', authMiddleware, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'file', maxCount: 1 }
]), async (req: AuthRequest, res) => {
  try {
    const { category, text, pollQuestion, pollOptions, youtubeUrl, linkPreview } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Обробляємо кілька фото
    const imageUrls = files?.images?.map(img => `/uploads/${img.filename}`) || [];
    const imageUrlsString = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;

    const fileUrl = files?.file?.[0] ? `/uploads/files/${files.file[0].filename}` : null;
    const fileName = files?.file?.[0] ? files.file[0].originalname : null;

    const post = await prisma.post.create({
      data: {
        userId: req.userId!,
        category,
        text,
        imageUrls: imageUrlsString,
        fileUrl,
        fileName,
        youtubeUrl: youtubeUrl || null,
        linkPreview: linkPreview || null,
        poll: pollQuestion ? {
          create: {
            question: pollQuestion,
            options: {
              create: JSON.parse(pollOptions).map((opt: string) => ({ text: opt, votes: 0 }))
            }
          }
        } : undefined
      },
      include: {
        user: { select: { id: true, username: true } },
        poll: { include: { options: true } }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Перевіряємо роль з токена (для спеціального адміна userId = 0)
    if (req.userId === 0) {
      // Спеціальний адмін - може видаляти все
      await prisma.post.delete({ where: { id: postId } });
      return res.json({ message: 'Post deleted' });
    }

    // Отримуємо інформацію про користувача
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    // Перевіряємо: або автор, або адмін
    if (post.userId !== req.userId && user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.post.delete({ where: { id: postId } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.post('/poll/:optionId/vote', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const optionId = parseInt(req.params.optionId);
    const option = await prisma.pollOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } }
    });
    res.json(option);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

export { router as postsRouter };
