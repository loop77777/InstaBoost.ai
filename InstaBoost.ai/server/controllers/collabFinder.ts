import { Request, Response } from 'express';
import axios from 'axios';
import User from '../../database/user';

interface CreatorProfile {
  id: string;
  username: string;
  display_name: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  engagement_rate: number;
  niche: string[];
  location: string;
  contact_email?: string;
  bio: string;
  verified: boolean;
  collaboration_score: number;
  mutual_growth_potential: number;
}

interface CollaborationOpportunity {
  creator: CreatorProfile;
  match_score: number;
  collaboration_type: 'cross_promotion' | 'giveaway' | 'content_swap' | 'joint_live' | 'story_takeover';
  estimated_reach: number;
  mutual_benefit_score: number;
  suggested_approach: string;
  best_contact_method: string;
}

interface CollabCampaign {
  id: string;
  title: string;
  description: string;
  collaboration_type: string;
  target_audience: string;
  budget_range?: string;
  timeline: string;
  requirements: string[];
  created_by: string;
  applications: number;
  status: 'open' | 'in_progress' | 'completed';
}

export const findCollaborators = async (req: Request, res: Response) => {
  try {
    const { userId, niche, follower_range, location, collaboration_type } = req.body;
    
    // Check if user has Pro subscription
    const user = await User.findOne({ instagramId: userId });
    if (!user || user.subscription.plan === 'free') {
      return res.status(403).json({ 
        error: 'Pro subscription required for Collab Finder',
        upgrade_url: '/upgrade-to-pro'
      });
    }

    // Simulate creator discovery (in real app, use creator database or Instagram API)
    const potentialCollaborators = await findPotentialCollaborators(
      niche, 
      follower_range, 
      location, 
      collaboration_type
    );

    // Calculate collaboration scores
    const collaborationOpportunities: CollaborationOpportunity[] = potentialCollaborators.map(creator => {
      const matchScore = calculateMatchScore(user, creator, niche);
      const mutualBenefit = calculateMutualBenefit(user.followersCount, creator.followers_count);
      
      return {
        creator,
        match_score: matchScore,
        collaboration_type: determineCollaborationType(user, creator),
        estimated_reach: estimateCollaborationReach(user.followersCount, creator.followers_count),
        mutual_benefit_score: mutualBenefit,
        suggested_approach: generateApproachSuggestion(creator, collaboration_type),
        best_contact_method: determineBestContactMethod(creator)
      };
    });

    // Sort by match score
    const sortedOpportunities = collaborationOpportunities
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 20); // Top 20 matches

    res.json({
      success: true,
      user_profile: {
        username: user.username,
        followers: user.followersCount,
        niche: niche,
        collaboration_openness: 'high' // Based on user settings
      },
      collaboration_opportunities: sortedOpportunities,
      matching_criteria: {
        niche_match: niche,
        follower_range: follower_range,
        location: location,
        collaboration_type: collaboration_type
      },
      pro_features: {
        unlimited_searches: true,
        contact_information: true,
        collaboration_templates: true,
        success_tracking: true
      },
      recommendations: generateCollaborationRecommendations(sortedOpportunities, user)
    });

  } catch (error) {
    console.error('Collab finder error:', error);
    res.status(500).json({ 
      error: 'Failed to find collaborators',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCollaborationCampaigns = async (req: Request, res: Response) => {
  try {
    const { userId, niche, campaign_type } = req.query;
    
    // Check Pro subscription
    const user = await User.findOne({ instagramId: userId });
    if (!user || user.subscription.plan === 'free') {
      return res.status(403).json({ 
        error: 'Pro subscription required',
        message: 'Upgrade to Pro to access collaboration campaigns'
      });
    }

    // Generate sample collaboration campaigns
    const campaigns: CollabCampaign[] = generateCollaborationCampaigns(niche as string);

    // Filter by user's niche and preferences
    const relevantCampaigns = campaigns.filter(campaign => 
      !niche || campaign.target_audience.toLowerCase().includes((niche as string).toLowerCase())
    );

    res.json({
      success: true,
      campaigns: relevantCampaigns,
      user_eligibility: {
        eligible_campaigns: relevantCampaigns.length,
        profile_strength: calculateProfileStrength(user),
        recommendations: getEligibilityRecommendations(user)
      },
      campaign_tips: [
        "Create a strong portfolio of your best content",
        "Be specific about your collaboration ideas",
        "Respond quickly to campaign opportunities",
        "Follow up professionally after applications"
      ]
    });

  } catch (error) {
    console.error('Collaboration campaigns error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCollaborationRequest = async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      target_creator, 
      collaboration_type, 
      message, 
      proposed_timeline,
      deliverables 
    } = req.body;

    // Check Pro subscription
    const user = await User.findOne({ instagramId: userId });
    if (!user || user.subscription.plan === 'free') {
      return res.status(403).json({ 
        error: 'Pro subscription required for collaboration requests'
      });
    }

    // Validate collaboration request
    if (!target_creator || !collaboration_type || !message) {
      return res.status(400).json({ 
        error: 'Target creator, collaboration type, and message are required' 
      });
    }

    // Generate collaboration proposal
    const collaborationProposal = {
      id: generateCollaborationId(),
      from_user: {
        username: user.username,
        followers: user.followersCount,
        engagement_rate: user.analytics.totalEngagementRate
      },
      to_creator: target_creator,
      collaboration_details: {
        type: collaboration_type,
        timeline: proposed_timeline,
        deliverables: deliverables,
        estimated_reach: estimateCollaborationReach(user.followersCount, 50000) // Assumed target creator followers
      },
      message: message,
      created_at: new Date().toISOString(),
      status: 'pending',
      tracking_metrics: {
        views: 0,
        responses: 0,
        success_rate: 0
      }
    };

    // In a real app, you'd save this to database and send to target creator
    res.json({
      success: true,
      collaboration_request: collaborationProposal,
      next_steps: [
        "Your collaboration request has been sent",
        "You'll receive a notification when the creator responds",
        "Follow up if no response within 7 days",
        "Track your request in the Collaboration Dashboard"
      ],
      tips: [
        "Personalize your message to the creator's content",
        "Be specific about mutual benefits",
        "Include examples of your best collaborative work",
        "Suggest multiple collaboration formats"
      ]
    });

  } catch (error) {
    console.error('Collaboration request error:', error);
    res.status(500).json({ 
      error: 'Failed to create collaboration request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCollaborationHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ instagramId: userId });
    if (!user || user.subscription.plan === 'free') {
      return res.status(403).json({ 
        error: 'Pro subscription required' 
      });
    }

    // Simulate collaboration history
    const collaborationHistory = {
      total_collaborations: Math.floor(Math.random() * 20) + 5,
      successful_collaborations: Math.floor(Math.random() * 15) + 3,
      pending_requests: Math.floor(Math.random() * 5) + 1,
      success_rate: 75,
      recent_collaborations: generateRecentCollaborations(),
      performance_metrics: {
        average_reach_increase: "35%",
        average_engagement_boost: "28%",
        follower_growth_from_collabs: "15%",
        best_performing_collab_type: "cross_promotion"
      }
    };

    res.json({
      success: true,
      collaboration_history: collaborationHistory,
      insights: {
        most_successful_niche: "lifestyle",
        best_collaboration_day: "Wednesday",
        optimal_follower_ratio: "1:1.5",
        top_collaboration_formats: [
          "Instagram takeovers",
          "Joint giveaways", 
          "Content swaps",
          "Cross-promotions"
        ]
      },
      recommendations: [
        "Focus on creators with similar engagement rates",
        "Plan collaborations 2-3 weeks in advance",
        "Track performance metrics for each collaboration",
        "Build long-term partnerships with successful collaborators"
      ]
    });

  } catch (error) {
    console.error('Collaboration history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch collaboration history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper functions
async function findPotentialCollaborators(
  niche: string, 
  followerRange: string, 
  location: string, 
  collaborationType: string
): Promise<CreatorProfile[]> {
  // In a real app, this would query a creators database or use Instagram API
  const sampleCreators: CreatorProfile[] = [
    {
      id: '1',
      username: 'fitness_guru_sarah',
      display_name: 'Sarah Johnson',
      followers_count: 25000,
      following_count: 1500,
      media_count: 450,
      engagement_rate: 4.2,
      niche: ['fitness', 'wellness', 'lifestyle'],
      location: 'Los Angeles, CA',
      contact_email: 'collab@sarahjohnson.com',
      bio: 'Fitness coach & wellness advocate. Helping people transform their lives 💪',
      verified: false,
      collaboration_score: 85,
      mutual_growth_potential: 92
    },
    {
      id: '2',
      username: 'healthy_eats_mike',
      display_name: 'Mike Rodriguez',
      followers_count: 18000,
      following_count: 800,
      media_count: 320,
      engagement_rate: 5.1,
      niche: ['food', 'health', 'cooking'],
      location: 'New York, NY',
      bio: 'Nutritionist sharing delicious healthy recipes 🥗',
      verified: false,
      collaboration_score: 78,
      mutual_growth_potential: 88
    },
    {
      id: '3',
      username: 'travel_with_emma',
      display_name: 'Emma Thompson',
      followers_count: 35000,
      following_count: 2200,
      media_count: 680,
      engagement_rate: 3.8,
      niche: ['travel', 'adventure', 'photography'],
      location: 'London, UK',
      contact_email: 'hello@emmathompson.com',
      bio: 'Adventure seeker & travel photographer 📸✈️',
      verified: true,
      collaboration_score: 91,
      mutual_growth_potential: 87
    }
  ];

  // Filter based on criteria
  return sampleCreators.filter(creator => {
    const nicheMatch = !niche || creator.niche.some(n => 
      n.toLowerCase().includes(niche.toLowerCase())
    );
    
    const followerMatch = checkFollowerRange(creator.followers_count, followerRange);
    const locationMatch = !location || creator.location.toLowerCase().includes(location.toLowerCase());
    
    return nicheMatch && followerMatch && locationMatch;
  });
}

function calculateMatchScore(user: any, creator: CreatorProfile, targetNiche: string): number {
  let score = 0;
  
  // Niche alignment (40% weight)
  const nicheMatch = creator.niche.some(n => 
    n.toLowerCase().includes(targetNiche?.toLowerCase() || '')
  );
  score += nicheMatch ? 40 : 0;
  
  // Follower ratio compatibility (25% weight)
  const followerRatio = Math.min(user.followersCount, creator.followers_count) / 
                       Math.max(user.followersCount, creator.followers_count);
  score += followerRatio * 25;
  
  // Engagement rate (20% weight)
  score += Math.min(creator.engagement_rate * 4, 20);
  
  // Collaboration score (15% weight)
  score += (creator.collaboration_score / 100) * 15;
  
  return Math.round(score);
}

function calculateMutualBenefit(userFollowers: number, creatorFollowers: number): number {
  const ratio = Math.min(userFollowers, creatorFollowers) / Math.max(userFollowers, creatorFollowers);
  return Math.round(ratio * 100);
}

function determineCollaborationType(user: any, creator: CreatorProfile): CollaborationOpportunity['collaboration_type'] {
  const followerDiff = Math.abs(user.followersCount - creator.followers_count);
  
  if (followerDiff < 5000) return 'cross_promotion';
  if (creator.engagement_rate > 4) return 'content_swap';
  if (creator.followers_count > user.followersCount * 1.5) return 'story_takeover';
  return 'giveaway';
}

function estimateCollaborationReach(userFollowers: number, creatorFollowers: number): number {
  // Estimate combined reach considering overlap
  const overlapRate = 0.15; // Assume 15% overlap
  const effectiveReach = (userFollowers + creatorFollowers) * (1 - overlapRate);
  return Math.round(effectiveReach);
}

function generateApproachSuggestion(creator: CreatorProfile, collaborationType: string): string {
  const approaches = {
    'cross_promotion': `Hi ${creator.display_name}! I love your content about ${creator.niche[0]}. I think our audiences would really benefit from a cross-promotion collaboration.`,
    'giveaway': `Hey ${creator.display_name}! Your engagement is amazing. Would you be interested in hosting a joint giveaway to grow both our communities?`,
    'content_swap': `Hi ${creator.display_name}! I admire your ${creator.niche[0]} content. Would you be open to a content collaboration where we create complementary posts?`,
    'story_takeover': `Hello ${creator.display_name}! I'd love to do a story takeover collaboration to share different perspectives with our audiences.`
  };
  
  return approaches[collaborationType as keyof typeof approaches] || approaches['cross_promotion'];
}

function determineBestContactMethod(creator: CreatorProfile): string {
  if (creator.contact_email) return 'Email';
  if (creator.verified) return 'Instagram DM (verified account)';
  return 'Instagram DM';
}

function generateCollaborationRecommendations(opportunities: CollaborationOpportunity[], user: any): string[] {
  const recommendations = [];
  
  if (opportunities.length > 0) {
    const topMatch = opportunities[0];
    recommendations.push(`Start with ${topMatch.creator.username} - highest match score (${topMatch.match_score}%)`);
  }
  
  recommendations.push(
    "Focus on creators with similar engagement rates for better collaboration outcomes",
    "Prepare a collaboration media kit with your best content examples",
    "Be specific about deliverables and timeline in your outreach",
    "Follow up within 1 week if you don't receive a response"
  );
  
  return recommendations;
}

function generateCollaborationCampaigns(niche: string): CollabCampaign[] {
  const campaigns: CollabCampaign[] = [
    {
      id: 'camp_001',
      title: 'Summer Fitness Challenge',
      description: 'Looking for fitness creators to join a 30-day summer challenge collaboration',
      collaboration_type: 'challenge',
      target_audience: 'fitness enthusiasts, wellness community',
      budget_range: '$500-1000',
      timeline: '4 weeks starting July 1st',
      requirements: ['10K+ followers', 'fitness niche', 'high engagement'],
      created_by: '@fitnessbrand',
      applications: 23,
      status: 'open'
    },
    {
      id: 'camp_002',
      title: 'Food Photography Collab',
      description: 'Food bloggers wanted for recipe exchange and cross-promotion',
      collaboration_type: 'content_swap',
      target_audience: 'food lovers, cooking enthusiasts',
      timeline: 'Ongoing',
      requirements: ['food/cooking niche', 'quality photography', 'active posting'],
      created_by: '@foodienetwork',
      applications: 15,
      status: 'open'
    },
    {
      id: 'camp_003',
      title: 'Travel Story Series',
      description: 'Travel creators for destination story takeovers and highlights',
      collaboration_type: 'story_takeover',
      target_audience: 'travel enthusiasts, adventure seekers',
      budget_range: 'Revenue share',
      timeline: '3 months',
      requirements: ['travel content', '5K+ followers', 'video skills'],
      created_by: '@wanderlustmagazine',
      applications: 31,
      status: 'in_progress'
    }
  ];

  return niche ? campaigns.filter(camp => 
    camp.target_audience.toLowerCase().includes(niche.toLowerCase())
  ) : campaigns;
}

function calculateProfileStrength(user: any): number {
  let strength = 0;
  
  // Follower count (25%)
  strength += Math.min((user.followersCount / 10000) * 25, 25);
  
  // Engagement rate (30%)
  strength += Math.min(user.analytics.totalEngagementRate * 6, 30);
  
  // Content consistency (20%)
  strength += user.mediaCount > 50 ? 20 : (user.mediaCount / 50) * 20;
  
  // Profile completeness (25%)
  let completeness = 0;
  if (user.username) completeness += 5;
  if (user.displayName) completeness += 5;
  if (user.email) completeness += 5;
  if (user.profilePicture) completeness += 5;
  if (user.isBusinessAccount) completeness += 5;
  strength += completeness;
  
  return Math.round(strength);
}

function getEligibilityRecommendations(user: any): string[] {
  const recommendations = [];
  
  if (user.followersCount < 1000) {
    recommendations.push("Grow your follower count to 1K+ for more campaign opportunities");
  }
  
  if (user.analytics.totalEngagementRate < 3) {
    recommendations.push("Improve engagement rate to 3%+ to qualify for premium campaigns");
  }
  
  if (user.mediaCount < 20) {
    recommendations.push("Post more content to build a stronger portfolio");
  }
  
  if (!user.isBusinessAccount) {
    recommendations.push("Switch to Instagram Business account for better collaboration features");
  }
  
  return recommendations.length > 0 ? recommendations : ["Your profile looks great for collaborations!"];
}

function generateCollaborationId(): string {
  return 'collab_' + Math.random().toString(36).substr(2, 9);
}

function checkFollowerRange(followers: number, range: string): boolean {
  if (!range) return true;
  
  const ranges: Record<string, [number, number]> = {
    'micro': [1000, 10000],
    'mid': [10000, 100000],
    'macro': [100000, 1000000],
    'mega': [1000000, Infinity]
  };
  
  const [min, max] = ranges[range] || [0, Infinity];
  return followers >= min && followers <= max;
}

function generateRecentCollaborations() {
  return [
    {
      creator: '@fitness_sarah',
      type: 'cross_promotion',
      date: '2024-06-15',
      reach: 45000,
      engagement: '6.2%',
      status: 'completed'
    },
    {
      creator: '@healthy_mike',
      type: 'content_swap',
      date: '2024-06-01',
      reach: 32000,
      engagement: '4.8%',
      status: 'completed'
    },
    {
      creator: '@travel_emma',
      type: 'giveaway',
      date: '2024-05-20',
      reach: 78000,
      engagement: '8.1%',
      status: 'completed'
    }
  ];
}
