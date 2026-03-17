import express, { Request, Response } from 'express';

const router = express.Router();

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name } = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Update user in database
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
