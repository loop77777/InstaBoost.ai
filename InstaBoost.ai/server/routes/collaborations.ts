import express from 'express';
import { 
  findCollaborators, 
  getCollaborationCampaigns,
  createCollaborationRequest,
  getCollaborationHistory
} from '../controllers/collabFinder';

const router = express.Router();

// Find potential collaborators
router.post('/find', findCollaborators);

// Get collaboration campaigns
router.get('/campaigns', getCollaborationCampaigns);

// Create collaboration request
router.post('/request', createCollaborationRequest);

// Get collaboration history
router.get('/history/:userId', getCollaborationHistory);

export default router;
