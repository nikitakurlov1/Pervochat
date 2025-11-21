import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { postId } = req.body;
    
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: req.userId!
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ liked: false });
    }

    await prisma.like.create({
      data: {
        postId: parseInt(postId),
        userId: req.userId!
      }
    });

    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export { router as likesRouter };
