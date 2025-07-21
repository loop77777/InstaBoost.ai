import { Router } from 'express';
import { generateCaption, generateHashtags, analyzePost } from '../controllers/captionGen';

const router = Router();

// POST /api/captions/generate
router.post('/generate', generateCaption);

// POST /api/captions/hashtags
router.post('/hashtags', generateHashtags);

// POST /api/captions/analyze
router.post('/analyze', analyzePost);

module.exports = router;
