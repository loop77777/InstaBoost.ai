import { Router } from 'express';

const router = Router();

// Analytics endpoints
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Analytics dashboard endpoint - to be implemented' });
});

router.get('/followers', (req, res) => {
  res.json({ message: 'Followers analytics endpoint - to be implemented' });
});

router.get('/engagement', (req, res) => {
  res.json({ message: 'Engagement analytics endpoint - to be implemented' });
});

module.exports = router;
