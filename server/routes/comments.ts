import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { postId, text } = req.body;
    
    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        userId: req.userId!,
        text
      },
      include: {
        user: { select: { id: true, username: true } }
      }
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Перевіряємо роль з токена (для спеціального адміна userId = 0)
    if (req.userId === 0) {
      // Спеціальний адмін - може видаляти все
      await prisma.comment.delete({ where: { id: commentId } });
      return res.json({ message: 'Comment deleted' });
    }

    // Отримуємо інформацію про користувача
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    
    // Перевіряємо: або автор, або адмін
    if (comment.userId !== req.userId && user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export { router as commentsRouter };
