import { Request, Response } from 'express';
import axios from 'axios';
import User from '../../database/user';

interface FollowerAnalytics {
  current_count: number;
  growth_rate: number;
  weekly_change: number;
  monthly_change: number;
  growth_trend: 'increasing' | 'decreasing' | 'stable';
  prediction_next_month: number;
}

interface EngagementMetrics {
  average_likes: number;
  average_comments: number;
  average_saves: number;
  engagement_rate: number;
  best_performing_post: any;
  worst_performing_post: any;
  engagement_trend: 'up' | 'down' | 'stable';
}

interface UnfollowerData {
  recent_unfollowers: string[];
  unfollower_count_24h: number;
  unfollower_count_7d: number;
  unfollower_rate: number;
  common_unfollow_reasons: string[];
}

interface GhostFollower {
  username: string;
  follower_ratio: number;
  engagement_rate: number;
  is_likely_bot: boolean;
  account_age_days: number;
}

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId, accessToken, timeframe = '30d' } = req.body;
    
    if (!userId || !accessToken) {
      return res.status(400).json({ 
        error: 'User ID and access token are required' 
      });
    }

    // Fetch user's basic info and media
    const [userInfo, mediaData] = await Promise.all([
      fetchUserInfo(userId, accessToken),
      fetchUserMedia(userId, accessToken, timeframe)
    ]);

    // Calculate analytics
    const followerAnalytics = await calculateFollowerAnalytics(userId, userInfo);
    const engagementMetrics = calculateEngagementMetrics(mediaData);
    const growthPrediction = predictGrowth(followerAnalytics, engagementMetrics);
    const contentInsights = analyzeContentPerformance(mediaData);
    
    // Fetch stored historical data from our database
    const historicalData = await getHistoricalData(userId);
    
    res.json({
      success: true,
      timeframe,
      user_info: {
        username: userInfo.username,
        followers_count: userInfo.followers_count,
        following_count: userInfo.follows_count,
        media_count: userInfo.media_count,
        account_type: userInfo.account_type || 'personal'
      },
      analytics: {
        followers: followerAnalytics,
        engagement: engagementMetrics,
        content_performance: contentInsights,
        growth_prediction: growthPrediction
      },
      insights: {
        best_posting_times: getBestPostingTimes(mediaData),
        top_hashtags: getTopPerformingHashtags(mediaData),
        audience_insights: getAudienceInsights(userInfo),
        recommendations: generateGrowthRecommendations(followerAnalytics, engagementMetrics)
      },
      historical_data: historicalData
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUnfollowerAnalysis = async (req: Request, res: Response) => {
  try {
    const { userId, accessToken } = req.body;
    
    // In a real implementation, you'd need to track followers over time
    // For now, we'll simulate unfollower data
    const unfollowerData: UnfollowerData = {
      recent_unfollowers: await getRecentUnfollowers(userId),
      unfollower_count_24h: Math.floor(Math.random() * 10) + 1,
      unfollower_count_7d: Math.floor(Math.random() * 50) + 10,
      unfollower_rate: Math.random() * 5 + 1, // 1-6%
      common_unfollow_reasons: [
        "Inactive posting schedule",
        "Content not matching interests",
        "Too many promotional posts",
        "Poor content quality",
        "Changed niche focus"
      ]
    };

    res.json({
      success: true,
      unfollower_analysis: unfollowerData,
      retention_tips: [
        "Post consistently at optimal times",
        "Engage with your audience regularly",
        "Maintain content quality standards",
        "Stay true to your niche",
        "Respond to comments and DMs promptly"
      ],
      benchmark: {
        healthy_unfollow_rate: "2-4% monthly",
        your_rate: `${unfollowerData.unfollower_rate.toFixed(1)}%`,
        status: unfollowerData.unfollower_rate < 4 ? "healthy" : "needs_attention"
      }
    });

  } catch (error) {
    console.error('Unfollower analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze unfollowers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getGhostFollowers = async (req: Request, res: Response) => {
  try {
    const { userId, accessToken } = req.body;
    
    // Fetch followers (limited by Instagram API)
    const followersResponse = await axios.get(
      `https://graph.instagram.com/v18.0/${userId}`,
      {
        params: {
          fields: 'followers_count',
          access_token: accessToken
        }
      }
    );

    // Simulate ghost follower detection
    const totalFollowers = followersResponse.data.followers_count;
    const estimatedGhostCount = Math.floor(totalFollowers * (Math.random() * 0.15 + 0.05)); // 5-20%
    
    const ghostFollowers: GhostFollower[] = Array.from({ length: Math.min(10, estimatedGhostCount) }, (_, i) => ({
      username: `ghost_user_${i + 1}`,
      follower_ratio: Math.random() * 0.1, // Low follower ratio
      engagement_rate: Math.random() * 0.5, // Very low engagement
      is_likely_bot: Math.random() > 0.7,
      account_age_days: Math.floor(Math.random() * 30) + 1 // New accounts
    }));

    res.json({
      success: true,
      ghost_analysis: {
        total_followers: totalFollowers,
        estimated_ghost_followers: estimatedGhostCount,
        ghost_percentage: ((estimatedGhostCount / totalFollowers) * 100).toFixed(1),
        sample_ghost_accounts: ghostFollowers
      },
      cleanup_recommendations: [
        "Remove followers with no profile picture",
        "Block obvious bot accounts",
        "Remove followers with suspicious usernames",
        "Check accounts with very low engagement",
        "Use Instagram's spam filter tools"
      ],
      healthy_metrics: {
        ideal_ghost_percentage: "5-10%",
        your_status: estimatedGhostCount / totalFollowers < 0.1 ? "healthy" : "needs_cleanup",
        quality_score: Math.max(0, 100 - (estimatedGhostCount / totalFollowers * 100)).toFixed(0)
      }
    });

  } catch (error) {
    console.error('Ghost followers error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze ghost followers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCompetitorAnalysis = async (req: Request, res: Response) => {
  try {
    const { competitors, niche } = req.body;
    
    if (!competitors || competitors.length === 0) {
      return res.status(400).json({ error: 'Competitor usernames required' });
    }

    const competitorData = [];
    
    for (const competitor of competitors.slice(0, 5)) { // Limit to 5 competitors
      try {
        // In a real implementation, you'd fetch competitor data
        // For now, we'll simulate competitor analytics
        const competitorAnalytics = {
          username: competitor,
          followers: Math.floor(Math.random() * 100000) + 10000,
          following: Math.floor(Math.random() * 5000) + 500,
          posts: Math.floor(Math.random() * 500) + 100,
          engagement_rate: (Math.random() * 8 + 1).toFixed(2),
          avg_likes: Math.floor(Math.random() * 5000) + 500,
          avg_comments: Math.floor(Math.random() * 200) + 20,
          posting_frequency: Math.floor(Math.random() * 7) + 1, // posts per week
          top_hashtags: generateCompetitorHashtags(niche),
          content_types: analyzeContentTypes(),
          growth_trend: ['growing', 'stable', 'declining'][Math.floor(Math.random() * 3)]
        };
        
        competitorData.push(competitorAnalytics);
      } catch (error) {
        console.log(`Failed to analyze competitor: ${competitor}`);
      }
    }

    // Generate insights based on competitor data
    const insights = generateCompetitorInsights(competitorData);

    res.json({
      success: true,
      competitor_analysis: competitorData,
      insights: insights,
      opportunities: identifyOpportunities(competitorData, niche),
      recommendations: generateCompetitorRecommendations(competitorData)
    });

  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze competitors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper functions
async function fetchUserInfo(userId: string, accessToken: string) {
  const response = await axios.get(
    `https://graph.instagram.com/v18.0/${userId}`,
    {
      params: {
        fields: 'account_type,username,followers_count,follows_count,media_count',
        access_token: accessToken
      }
    }
  );
  return response.data;
}

async function fetchUserMedia(userId: string, accessToken: string, timeframe: string) {
  const limit = timeframe === '7d' ? 10 : timeframe === '30d' ? 25 : 50;
  
  const response = await axios.get(
    `https://graph.instagram.com/v18.0/${userId}/media`,
    {
      params: {
        fields: 'id,media_type,timestamp,like_count,comments_count,caption',
        limit: limit,
        access_token: accessToken
      }
    }
  );
  return response.data.data;
}

async function calculateFollowerAnalytics(userId: string, userInfo: any): Promise<FollowerAnalytics> {
  // In a real app, you'd fetch historical data from your database
  const currentCount = userInfo.followers_count;
  const weeklyChange = Math.floor(Math.random() * 100) - 50; // -50 to +50
  const monthlyChange = Math.floor(Math.random() * 400) - 200; // -200 to +200
  const growthRate = (monthlyChange / currentCount) * 100;
  
  return {
    current_count: currentCount,
    growth_rate: parseFloat(growthRate.toFixed(2)),
    weekly_change: weeklyChange,
    monthly_change: monthlyChange,
    growth_trend: growthRate > 5 ? 'increasing' : growthRate < -5 ? 'decreasing' : 'stable',
    prediction_next_month: currentCount + Math.floor(monthlyChange * 1.1)
  };
}

function calculateEngagementMetrics(mediaData: any[]): EngagementMetrics {
  if (mediaData.length === 0) {
    return {
      average_likes: 0,
      average_comments: 0,
      average_saves: 0,
      engagement_rate: 0,
      best_performing_post: null,
      worst_performing_post: null,
      engagement_trend: 'stable'
    };
  }

  const totalLikes = mediaData.reduce((sum, post) => sum + (post.like_count || 0), 0);
  const totalComments = mediaData.reduce((sum, post) => sum + (post.comments_count || 0), 0);
  
  const avgLikes = totalLikes / mediaData.length;
  const avgComments = totalComments / mediaData.length;
  const engagementRate = ((totalLikes + totalComments) / mediaData.length / 1000) * 100; // Simplified calculation

  const sortedByEngagement = mediaData.sort((a, b) => 
    ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0))
  );

  return {
    average_likes: Math.round(avgLikes),
    average_comments: Math.round(avgComments),
    average_saves: Math.round(avgLikes * 0.1), // Estimated
    engagement_rate: parseFloat(engagementRate.toFixed(2)),
    best_performing_post: sortedByEngagement[0],
    worst_performing_post: sortedByEngagement[sortedByEngagement.length - 1],
    engagement_trend: 'stable' // Would need historical data to determine
  };
}

function predictGrowth(followers: FollowerAnalytics, engagement: EngagementMetrics) {
  const qualityScore = Math.min(100, engagement.engagement_rate * 10);
  const growthPotential = (qualityScore + Math.abs(followers.growth_rate)) / 2;
  
  return {
    quality_score: Math.round(qualityScore),
    growth_potential: Math.round(growthPotential),
    predicted_followers_3_months: followers.current_count + (followers.monthly_change * 3),
    confidence_level: qualityScore > 70 ? 'high' : qualityScore > 40 ? 'medium' : 'low',
    key_growth_factors: [
      engagement.engagement_rate > 5 ? 'High engagement rate' : 'Improve engagement',
      followers.growth_trend === 'increasing' ? 'Positive growth trend' : 'Focus on growth strategies',
      'Consistent posting schedule needed'
    ]
  };
}

function analyzeContentPerformance(mediaData: any[]) {
  const contentTypes = mediaData.reduce((acc: any, post) => {
    const type = post.media_type || 'IMAGE';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const avgPerformanceByType: any = {};
  Object.keys(contentTypes).forEach(type => {
    const postsOfType = mediaData.filter(post => post.media_type === type);
    const avgEngagement = postsOfType.reduce((sum, post) => 
      sum + (post.like_count || 0) + (post.comments_count || 0), 0
    ) / postsOfType.length;
    avgPerformanceByType[type] = Math.round(avgEngagement);
  });

  return {
    content_distribution: contentTypes,
    performance_by_type: avgPerformanceByType,
    best_performing_type: Object.keys(avgPerformanceByType).reduce((a, b) => 
      avgPerformanceByType[a] > avgPerformanceByType[b] ? a : b
    ),
    recommendations: generateContentRecommendations(avgPerformanceByType)
  };
}

function getBestPostingTimes(mediaData: any[]) {
  const hourCounts: any = {};
  const hourPerformance: any = {};

  mediaData.forEach(post => {
    const hour = new Date(post.timestamp).getHours();
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    hourPerformance[hour] = (hourPerformance[hour] || 0) + engagement;
  });

  // Calculate average performance per hour
  Object.keys(hourPerformance).forEach(hour => {
    hourPerformance[hour] = hourPerformance[hour] / hourCounts[hour];
  });

  const sortedHours = Object.keys(hourPerformance).sort((a, b) => 
    hourPerformance[b] - hourPerformance[a]
  );

  return {
    best_hours: sortedHours.slice(0, 3).map(h => `${h}:00`),
    performance_by_hour: hourPerformance,
    recommendations: [
      `Post between ${sortedHours[0]}:00-${sortedHours[1]}:00 for best results`,
      "Avoid posting during low-engagement hours",
      "Test different time slots for your audience"
    ]
  };
}

function getTopPerformingHashtags(mediaData: any[]) {
  const hashtagMap: any = {};
  
  mediaData.forEach(post => {
    if (post.caption) {
      const hashtags = post.caption.match(/#\w+/g) || [];
      const engagement = (post.like_count || 0) + (post.comments_count || 0);
      
      hashtags.forEach((tag: string) => {
        if (!hashtagMap[tag]) {
          hashtagMap[tag] = { count: 0, total_engagement: 0 };
        }
        hashtagMap[tag].count++;
        hashtagMap[tag].total_engagement += engagement;
      });
    }
  });

  const topHashtags = Object.keys(hashtagMap)
    .map(tag => ({
      hashtag: tag,
      usage_count: hashtagMap[tag].count,
      avg_engagement: Math.round(hashtagMap[tag].total_engagement / hashtagMap[tag].count)
    }))
    .sort((a, b) => b.avg_engagement - a.avg_engagement)
    .slice(0, 10);

  return topHashtags;
}

function getAudienceInsights(userInfo: any) {
  // Simulated audience insights - in real app, use Instagram Insights API
  return {
    primary_demographics: {
      age_range: "25-34",
      gender_split: { female: 60, male: 35, other: 5 },
      top_locations: ["United States", "United Kingdom", "Canada"]
    },
    active_hours: ["7-9 AM", "12-2 PM", "7-9 PM"],
    engagement_patterns: {
      weekday_vs_weekend: "Weekdays perform 20% better",
      best_days: ["Tuesday", "Wednesday", "Thursday"]
    }
  };
}

function generateGrowthRecommendations(followers: FollowerAnalytics, engagement: EngagementMetrics) {
  const recommendations = [];
  
  if (followers.growth_rate < 0) {
    recommendations.push("Focus on retention strategies to stop follower loss");
  }
  
  if (engagement.engagement_rate < 3) {
    recommendations.push("Improve engagement by asking questions and responding to comments");
  }
  
  if (followers.growth_rate < 5) {
    recommendations.push("Increase posting frequency and use trending hashtags");
  }
  
  recommendations.push("Collaborate with other creators in your niche");
  recommendations.push("Post consistently during your peak audience hours");
  
  return recommendations;
}

async function getHistoricalData(userId: string) {
  try {
    const user = await User.findOne({ instagramId: userId });
    if (!user) return null;
    
    // Return stored historical analytics
    return {
      follower_history: [], // Would store daily follower counts
      engagement_history: [], // Would store daily engagement rates
      last_updated: user.lastSync
    };
  } catch (error) {
    return null;
  }
}

async function getRecentUnfollowers(userId: string): Promise<string[]> {
  // Simulated unfollower data - in real app, track followers over time
  return ['user1', 'user2', 'user3'].map(u => `${u}_unfollowed`);
}

function generateCompetitorHashtags(niche: string): string[] {
  const hashtags: Record<string, string[]> = {
    'fitness': ['#fitness', '#workout', '#health', '#gym'],
    'food': ['#food', '#recipe', '#cooking', '#foodie'],
    'travel': ['#travel', '#adventure', '#wanderlust', '#explore']
  };
  return hashtags[niche] || ['#content', '#creator'];
}

function analyzeContentTypes() {
  return {
    photos: Math.floor(Math.random() * 50) + 30,
    videos: Math.floor(Math.random() * 40) + 20,
    reels: Math.floor(Math.random() * 30) + 10,
    stories: Math.floor(Math.random() * 20) + 5
  };
}

function generateCompetitorInsights(competitors: any[]) {
  const avgEngagement = competitors.reduce((sum, comp) => 
    sum + parseFloat(comp.engagement_rate), 0
  ) / competitors.length;
  
  return {
    market_average_engagement: avgEngagement.toFixed(2),
    top_performer: competitors.reduce((prev, current) => 
      parseFloat(prev.engagement_rate) > parseFloat(current.engagement_rate) ? prev : current
    ),
    common_posting_frequency: "5-7 posts per week",
    trending_hashtags: ['#trending', '#viral', '#content']
  };
}

function identifyOpportunities(competitors: any[], niche: string) {
  return [
    "Underserved content types in your niche",
    "Optimal posting times with less competition",
    "Hashtag gaps your competitors aren't using",
    "Audience segments not fully targeted"
  ];
}

function generateCompetitorRecommendations(competitors: any[]) {
  return [
    "Study top performer's content strategy",
    "Find content gaps in your niche",
    "Optimize posting frequency based on competitors",
    "Use unique hashtag combinations"
  ];
}

function generateContentRecommendations(performanceByType: any) {
  const bestType = Object.keys(performanceByType).reduce((a, b) => 
    performanceByType[a] > performanceByType[b] ? a : b
  );
  
  return [
    `Focus more on ${bestType.toLowerCase()} content as it performs best`,
    "Experiment with mixed media posts",
    "Create content series for consistency",
    "Analyze competitor content strategies"
  ];
}
