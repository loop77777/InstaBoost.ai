import { Router } from 'express';

const router = Router();

// Business sponsor management routes
router.get('/businesses/:businessId/sponsors', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Mock data for demonstration
    const sponsors = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        logo: 'https://via.placeholder.com/60',
        category: 'Technology',
        budget: 50000,
        activeInfluencers: 12,
        campaignStatus: 'active',
        performance: { reach: 2500000, engagement: 185000, conversions: 1250, roi: 3.2 },
        dateAdded: '2024-01-15',
        lastActivity: '2024-03-20'
      }
    ];

    res.json({
      success: true,
      data: {
        sponsors,
        summary: {
          totalSponsors: sponsors.length,
          activeSponsors: sponsors.filter(s => s.campaignStatus === 'active').length,
          totalBudget: sponsors.reduce((sum, s) => sum + s.budget, 0),
          totalInfluencers: sponsors.reduce((sum, s) => sum + s.activeInfluencers, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sponsors'
    });
  }
});

router.post('/businesses/:businessId/sponsors', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { name, logo, category, budget, description } = req.body;

    if (!name || !category || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and budget are required'
      });
    }

    const newSponsor = {
      id: Date.now().toString(),
      businessId,
      name,
      logo: logo || '',
      category,
      budget: parseFloat(budget),
      description: description || '',
      activeInfluencers: 0,
      campaignStatus: 'active',
      performance: {
        reach: 0,
        engagement: 0,
        conversions: 0,
        roi: 0
      },
      dateAdded: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Sponsor added successfully',
      data: newSponsor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add sponsor'
    });
  }
});

router.delete('/businesses/:businessId/sponsors/:sponsorId', async (req, res) => {
  try {
    const { businessId, sponsorId } = req.params;
    
    res.json({
      success: true,
      message: 'Sponsor removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove sponsor'
    });
  }
});

router.get('/businesses/:businessId/partnerships', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const partnerships = [
      {
        id: '1',
        influencerName: '@fashionista_jane',
        followers: 125000,
        engagementRate: 4.2,
        category: 'Fashion',
        status: 'active',
        campaignResults: { posts: 12, reach: 890000, engagement: 37500, clicks: 2100 },
        contractEnd: '2024-06-30'
      },
      {
        id: '2',
        influencerName: '@tech_reviewer_pro',
        followers: 85000,
        engagementRate: 6.1,
        category: 'Technology',
        status: 'inactive',
        campaignResults: { posts: 8, reach: 520000, engagement: 31700, clicks: 1580 },
        contractEnd: '2024-03-15'
      }
    ];

    const inactivePartnerships = partnerships.filter(p => p.status === 'inactive');

    res.json({
      success: true,
      data: {
        partnerships,
        healthMetrics: {
          totalPartnerships: partnerships.length,
          activePartnerships: partnerships.filter(p => p.status === 'active').length,
          inactivePartnerships: inactivePartnerships.length,
          removalSuggestions: inactivePartnerships.map(p => ({
            partnershipId: p.id,
            influencerName: p.influencerName,
            reason: 'Partnership marked as inactive',
            potentialImpact: {
              reachLoss: p.campaignResults.reach,
              budgetSaved: 5000
            }
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch partnerships'
    });
  }
});

router.delete('/businesses/:businessId/partnerships/inactive', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { partnershipIds, autoRemove = false } = req.body;

    res.json({
      success: true,
      message: 'Inactive partnerships removed successfully',
      data: {
        removedCount: 2,
        impactAnalysis: {
          totalReachLoss: 520000,
          budgetSaved: 10000,
          communityHealthImprovement: 25
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove inactive partnerships'
    });
  }
});

router.get('/businesses/:businessId/analytics/community-growth', async (req, res) => {
  try {
    const { businessId } = req.params;

    const analytics = {
      metrics: {
        totalBusinesses: 1,
        activeSponsors: 5,
        totalPartnerships: 15,
        inactivePartnerships: 3,
        communityHealthScore: 78,
        growthTrends: {
          weeklyGrowth: 2,
          monthlyGrowth: 8,
          partnershipRetention: 85
        }
      },
      recommendations: [
        {
          type: 'optimization',
          title: 'Remove Inactive Partnerships',
          description: 'You have 3 inactive partnerships that could be removed to improve community growth',
          priority: 'high',
          action: 'remove_inactive'
        },
        {
          type: 'engagement',
          title: 'Improve Engagement Rates',
          description: 'Focus on micro-influencers with higher engagement rates for better community growth',
          priority: 'medium',
          action: 'improve_engagement'
        }
      ],
      insights: {
        topPerformingSponsors: [
          { name: 'TechCorp Solutions', roi: 3.2 },
          { name: 'Fashion Forward', roi: 2.8 }
        ],
        budgetOptimization: {
          totalBudget: 150000,
          recommendedReallocation: [
            {
              sponsorName: 'TechCorp Solutions',
              currentBudget: 50000,
              recommendedBudget: 60000,
              reasoning: 'High ROI - consider increasing budget'
            }
          ]
        }
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community growth analytics'
    });
  }
});

// User-facing sponsor discovery routes
router.get('/users/:userId/available-sponsors', async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, minBudget, maxBudget } = req.query;

    const availableSponsors = [
      {
        id: '1',
        name: 'EcoFriendly Brand',
        logo: 'https://via.placeholder.com/60',
        category: 'Lifestyle',
        description: 'Sustainable products for everyday life',
        campaignBudget: 25000,
        requirements: {
          minFollowers: 10000,
          categories: ['lifestyle', 'sustainability', 'health'],
          engagementRate: 2.5
        },
        benefits: {
          paymentPerPost: 500,
          productGifts: true,
          longTermPartnership: true
        },
        isVerified: true,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Tech Innovations Hub',
        logo: 'https://via.placeholder.com/60',
        category: 'Technology',
        description: 'Latest gadgets and tech reviews',
        campaignBudget: 40000,
        requirements: {
          minFollowers: 25000,
          categories: ['technology', 'reviews', 'gadgets'],
          engagementRate: 3.0
        },
        benefits: {
          paymentPerPost: 800,
          productGifts: true,
          exclusiveAccess: true
        },
        isVerified: true,
        rating: 4.9
      }
    ];

    res.json({
      success: true,
      data: {
        sponsors: availableSponsors,
        matchingCriteria: {
          userFollowers: 15000,
          userEngagement: 4.2,
          userCategories: ['lifestyle', 'technology'],
          eligibleSponsors: 2
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available sponsors'
    });
  }
});

router.post('/users/:userId/sponsor-applications', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sponsorId, message, portfolio } = req.body;

    res.json({
      success: true,
      message: 'Sponsor application submitted successfully',
      data: {
        applicationId: Date.now().toString(),
        status: 'pending',
        estimatedResponse: '2-5 business days'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit sponsor application'
    });
  }
});

module.exports = router;
