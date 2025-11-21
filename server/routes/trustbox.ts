import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Створити повідомлення (для учнів)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Спеціальний адмін (userId = 0) не може створювати повідомлення
    if (req.userId === 0) {
      return res.status(403).json({ error: 'Admin cannot create trust messages' });
    }

    const message = await prisma.trustMessage.create({
      data: {
        userId: req.userId!,
        content: content.trim()
      }
    });

    res.json(message);
  } catch (error) {
    console.error('Failed to create trust message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Отримати свої повідомлення (для учня)
router.get('/my', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Спеціальний адмін не має своїх повідомлень
    if (req.userId === 0) {
      return res.json([]);
    }

    const messages = await prisma.trustMessage.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch my messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Отримати всі повідомлення (ТІЛЬКИ для адміна, без інформації про автора)
router.get('/all', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Перевіряємо чи це адмін (userId = 0 або роль ADMIN)
    if (req.userId !== 0) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const messages = await prisma.trustMessage.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        reply: true,
        isAnswered: true,
        createdAt: true,
        repliedAt: true
        // userId та user НЕ включаємо для анонімності
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch all messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Відповісти на повідомлення (ТІЛЬКИ для адміна)
router.patch('/:id/reply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Reply is required' });
    }

    // Перевіряємо чи це адмін
    if (req.userId !== 0) {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const message = await prisma.trustMessage.update({
      where: { id: messageId },
      data: {
        reply: reply.trim(),
        isAnswered: true,
        repliedAt: new Date()
      }
    });

    res.json(message);
  } catch (error) {
    console.error('Failed to reply to message:', error);
    res.status(500).json({ error: 'Failed to reply' });
  }
});

export { router as trustBoxRouter };
