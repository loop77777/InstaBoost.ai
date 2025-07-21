import { Request, Response } from 'express';
import axios from 'axios';

interface PostMetrics {
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
}

interface InstagramPostData {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  insights?: {
    data: Array<{
      name: string;
      values: Array<{ value: number }>;
    }>;
  };
}

export const analyzePostMetrics = async (req: Request, res: Response) => {
  try {
    const { postId, accessToken } = req.body;
    
    if (!postId || !accessToken) {
      return res.status(400).json({ 
        error: 'Post ID and access token are required' 
      });
    }

    // Fetch post data from Instagram Graph API
    const postResponse = await axios.get(
      `https://graph.instagram.com/v18.0/${postId}`,
      {
        params: {
          fields: 'id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count',
          access_token: accessToken
        }
      }
    );

    const postData: InstagramPostData = postResponse.data;

    // Fetch insights for business accounts
    let insights = null;
    try {
      const insightsResponse = await axios.get(
        `https://graph.instagram.com/v18.0/${postId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach,saved',
            access_token: accessToken
          }
        }
      );
      insights = insightsResponse.data;
    } catch (insightsError) {
      console.log('Insights not available (may be personal account)');
    }

    // Calculate engagement metrics
    const likes = postData.like_count || 0;
    const comments = postData.comments_count || 0;
    const saves = insights?.data?.find(m => m.name === 'saved')?.values[0]?.value || 0;
    const impressions = insights?.data?.find(m => m.name === 'impressions')?.values[0]?.value || 0;
    const reach = insights?.data?.find(m => m.name === 'reach')?.values[0]?.value || 0;
    
    const totalEngagements = likes + comments + saves;
    const engagementRate = impressions > 0 ? (totalEngagements / impressions) * 100 : 0;

    // Analyze posting time
    const postTime = new Date(postData.timestamp);
    const hour = postTime.getHours();
    const dayOfWeek = postTime.getDay();

    // AI analysis of caption and performance
    const analysisPrompt = `
    Analyze this Instagram post performance and provide insights:
    
    Post Details:
    - Caption: "${postData.caption}"
    - Likes: ${likes}
    - Comments: ${comments}
    - Saves: ${saves}
    - Reach: ${reach}
    - Impressions: ${impressions}
    - Engagement Rate: ${engagementRate.toFixed(2)}%
    - Posted at: ${postTime.toLocaleString()}
    
    Provide analysis in JSON format:
    {
      "performanceScore": 85,
      "strengths": ["High engagement rate", "Good caption hook"],
      "improvements": ["Use more hashtags", "Post at peak time"],
      "bestPostingTimes": ["7:00 PM", "9:00 AM", "12:00 PM"],
      "hashtagSuggestions": ["#trending", "#viral"],
      "contentRecommendations": ["Add more call-to-action", "Include trending topics"],
      "benchmarkComparison": {
        "industry_average_engagement": 3.2,
        "your_performance": "above_average"
      }
    }
    `;

    // This would use OpenAI - for now returning structured data
    const analysis = {
      performanceScore: Math.min(95, Math.max(10, engagementRate * 20)),
      strengths: [
        engagementRate > 3 ? "High engagement rate" : "Decent engagement",
        comments > likes * 0.05 ? "Good comment ratio" : "Standard interaction"
      ],
      improvements: [
        hour < 7 || hour > 22 ? "Consider posting during peak hours (7-9 AM, 7-9 PM)" : "",
        saves < likes * 0.1 ? "Add more valuable, save-worthy content" : "",
        !postData.caption?.includes('#') ? "Use relevant hashtags for better reach" : ""
      ].filter(Boolean),
      bestPostingTimes: getOptimalPostingTimes(dayOfWeek),
      hashtagSuggestions: extractRelevantHashtags(postData.caption || ''),
      contentRecommendations: generateContentRecommendations(engagementRate, likes, comments),
      benchmarkComparison: {
        industry_average_engagement: 3.2,
        your_performance: engagementRate > 3.2 ? "above_average" : "below_average"
      }
    };

    res.json({
      success: true,
      postData: {
        id: postData.id,
        caption: postData.caption,
        timestamp: postData.timestamp,
        media_type: postData.media_type
      },
      metrics: {
        likes,
        comments,
        saves,
        reach,
        impressions,
        engagement_rate: parseFloat(engagementRate.toFixed(2))
      },
      analysis,
      recommendations: {
        next_post_time: getNextOptimalTime(),
        content_strategy: generateContentStrategy(analysis.performanceScore)
      }
    });

  } catch (error) {
    console.error('Post analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function getOptimalPostingTimes(dayOfWeek: number): string[] {
  const times = {
    0: ["9:00 AM", "7:00 PM"], // Sunday
    1: ["7:00 AM", "12:00 PM", "6:00 PM"], // Monday
    2: ["7:00 AM", "12:00 PM", "7:00 PM"], // Tuesday
    3: ["7:00 AM", "1:00 PM", "7:00 PM"], // Wednesday
    4: ["7:00 AM", "12:00 PM", "8:00 PM"], // Thursday
    5: ["8:00 AM", "1:00 PM", "9:00 PM"], // Friday
    6: ["10:00 AM", "2:00 PM", "8:00 PM"]  // Saturday
  };
  
  return times[dayOfWeek as keyof typeof times] || ["12:00 PM", "7:00 PM"];
}

function extractRelevantHashtags(caption: string): string[] {
  const words = caption.toLowerCase().split(/\s+/);
  const suggestions = [];
  
  if (words.some(w => ['food', 'recipe', 'cooking'].includes(w))) {
    suggestions.push('#foodie', '#recipe', '#cooking');
  }
  if (words.some(w => ['workout', 'fitness', 'gym'].includes(w))) {
    suggestions.push('#fitness', '#workout', '#healthylifestyle');
  }
  if (words.some(w => ['travel', 'vacation', 'trip'].includes(w))) {
    suggestions.push('#travel', '#wanderlust', '#vacation');
  }
  
  return suggestions.length > 0 ? suggestions : ['#instagram', '#content', '#lifestyle'];
}

function generateContentRecommendations(engagementRate: number, likes: number, comments: number): string[] {
  const recommendations = [];
  
  if (engagementRate < 2) {
    recommendations.push("Use more engaging hooks in your captions");
    recommendations.push("Ask questions to encourage comments");
  }
  
  if (comments < likes * 0.03) {
    recommendations.push("Add call-to-action phrases like 'Comment below'");
    recommendations.push("Share personal stories to build connection");
  }
  
  if (likes < 100) {
    recommendations.push("Use trending hashtags in your niche");
    recommendations.push("Post during peak hours for your audience");
  }
  
  return recommendations.length > 0 ? recommendations : ["Keep creating quality content!"];
}

function getNextOptimalTime(): string {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 7) return "7:00 AM today";
  if (hour < 12) return "12:00 PM today";
  if (hour < 19) return "7:00 PM today";
  return "7:00 AM tomorrow";
}

function generateContentStrategy(performanceScore: number): string[] {
  if (performanceScore > 80) {
    return [
      "Your content is performing excellently! Keep this strategy.",
      "Consider creating similar content formats",
      "Experiment with posting frequency"
    ];
  } else if (performanceScore > 60) {
    return [
      "Good performance with room for improvement",
      "Try different content formats",
      "Optimize posting times"
    ];
  } else {
    return [
      "Content needs significant improvement",
      "Focus on audience research",
      "Study competitor strategies",
      "Improve visual quality"
    ];
  }
}

export const getUserInsights = async (req: Request, res: Response) => {
  try {
    const { userId, accessToken, period = '7d' } = req.body;
    
    // Fetch user media
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/v18.0/${userId}/media`,
      {
        params: {
          fields: 'id,media_type,timestamp,like_count,comments_count',
          limit: 25,
          access_token: accessToken
        }
      }
    );

    const posts = mediaResponse.data.data;
    
    // Calculate insights
    const totalLikes = posts.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0);
    const totalComments = posts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0);
    const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;
    const avgComments = posts.length > 0 ? totalComments / posts.length : 0;
    
    // Analyze posting patterns
    const postingHours = posts.map((post: any) => new Date(post.timestamp).getHours());
    const hourCounts = postingHours.reduce((acc: any, hour: number) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    
    const bestHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b
    );

    res.json({
      success: true,
      period,
      metrics: {
        total_posts: posts.length,
        total_likes: totalLikes,
        total_comments: totalComments,
        average_likes: Math.round(avgLikes),
        average_comments: Math.round(avgComments),
        engagement_rate: posts.length > 0 ? ((totalLikes + totalComments) / posts.length / 1000 * 100).toFixed(2) : 0
      },
      insights: {
        best_posting_hour: `${bestHour}:00`,
        most_engaging_content: posts.sort((a: any, b: any) => 
          (b.like_count + b.comments_count) - (a.like_count + a.comments_count)
        )[0],
        posting_consistency: calculateConsistency(posts),
        growth_trend: calculateGrowthTrend(posts)
      }
    });

  } catch (error) {
    console.error('User insights error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

function calculateConsistency(posts: any[]): string {
  if (posts.length < 7) return "Need more posts to analyze";
  
  const dates = posts.map(post => new Date(post.timestamp).toDateString());
  const uniqueDates = new Set(dates).size;
  const consistency = uniqueDates / 7; // posts per day over week
  
  if (consistency > 0.8) return "Excellent consistency";
  if (consistency > 0.5) return "Good consistency";
  return "Needs more consistent posting";
}

function calculateGrowthTrend(posts: any[]): string {
  if (posts.length < 5) return "Need more data";
  
  const recent = posts.slice(0, Math.floor(posts.length / 2));
  const older = posts.slice(Math.floor(posts.length / 2));
  
  const recentAvg = recent.reduce((sum, post) => sum + (post.like_count || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, post) => sum + (post.like_count || 0), 0) / older.length;
  
  const growth = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (growth > 10) return "Growing strongly";
  if (growth > 0) return "Slight growth";
  return "Declining performance";
}
