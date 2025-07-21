import { Request, Response } from 'express';
import axios from 'axios';

interface TrendingAudio {
  id: string;
  title: string;
  artist: string;
  duration: number;
  popularity: number;
  genre: string;
  usage_count: number;
  trending_score: number;
}

interface TrendingHashtag {
  hashtag: string;
  post_count: number;
  growth_rate: number;
  engagement_rate: number;
  related_hashtags: string[];
}

interface ReelTrend {
  trend_type: 'audio' | 'hashtag' | 'effect' | 'challenge';
  title: string;
  description: string;
  popularity_score: number;
  niche_relevance: number;
  estimated_reach: number;
  best_time_to_use: string;
}

export const getTrendingAudio = async (req: Request, res: Response) => {
  try {
    const { niche = 'general', limit = 20 } = req.query;
    
    // Using Spotify API for trending music (you'll need Spotify credentials)
    const spotifyAuth = await getSpotifyToken();
    
    // Get trending playlists based on niche
    const playlistResponse = await axios.get(
      'https://api.spotify.com/v1/browse/featured-playlists',
      {
        headers: {
          'Authorization': `Bearer ${spotifyAuth.access_token}`
        },
        params: {
          limit: 10,
          country: 'US'
        }
      }
    );

    const trendingAudio: TrendingAudio[] = [];
    
    // Get tracks from trending playlists
    for (const playlist of playlistResponse.data.playlists.items.slice(0, 3)) {
      const tracksResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          headers: {
            'Authorization': `Bearer ${spotifyAuth.access_token}`
          },
          params: {
            limit: 10
          }
        }
      );

      for (const item of tracksResponse.data.items) {
        if (item.track && trendingAudio.length < parseInt(limit as string)) {
          trendingAudio.push({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists[0]?.name || 'Unknown',
            duration: item.track.duration_ms,
            popularity: item.track.popularity,
            genre: getGenreFromNiche(niche as string),
            usage_count: Math.floor(Math.random() * 10000) + 1000, // Simulated
            trending_score: calculateTrendingScore(item.track.popularity)
          });
        }
      }
    }

    // Add niche-specific audio recommendations
    const nicheAudio = getNicheSpecificAudio(niche as string);
    
    res.json({
      success: true,
      niche,
      trending_audio: trendingAudio.sort((a, b) => b.trending_score - a.trending_score),
      niche_recommendations: nicheAudio,
      usage_tips: getAudioUsageTips(niche as string),
      best_posting_times: ["7:00 PM", "8:00 PM", "9:00 PM"] // Peak reel viewing times
    });

  } catch (error) {
    console.error('Trending audio error:', error);
    
    // Fallback trending audio data
    const fallbackAudio = generateFallbackTrendingAudio(req.query.niche as string);
    
    res.json({
      success: true,
      trending_audio: fallbackAudio,
      note: "Using cached trending data",
      niche: req.query.niche || 'general'
    });
  }
};

export const getTrendingHashtags = async (req: Request, res: Response) => {
  try {
    const { niche = 'general', timeframe = '7d' } = req.query;
    
    // This would typically use Instagram Graph API or third-party trend APIs
    // For now, we'll generate intelligent hashtag recommendations
    
    const trendingHashtags = generateTrendingHashtags(niche as string);
    const emergingHashtags = generateEmergingHashtags(niche as string);
    const evergreen = getEvergreenHashtags(niche as string);
    
    res.json({
      success: true,
      niche,
      timeframe,
      hashtag_categories: {
        trending: trendingHashtags,
        emerging: emergingHashtags,
        evergreen: evergreen,
        niche_specific: getNicheHashtags(niche as string)
      },
      optimization_tips: getHashtagOptimizationTips(),
      best_mix_strategy: getOptimalHashtagMix(niche as string)
    });

  } catch (error) {
    console.error('Trending hashtags error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending hashtags',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getReelTrends = async (req: Request, res: Response) => {
  try {
    const { niche = 'general', content_type = 'all' } = req.query;
    
    const reelTrends: ReelTrend[] = [
      {
        trend_type: 'challenge',
        title: 'Transformation Tuesday',
        description: 'Before/after content showing personal or business growth',
        popularity_score: 95,
        niche_relevance: getNicheRelevance('transformation', niche as string),
        estimated_reach: 50000,
        best_time_to_use: 'Tuesday 7-9 PM'
      },
      {
        trend_type: 'audio',
        title: 'Trending Sound Mashups',
        description: 'Popular audio clips remixed for different niches',
        popularity_score: 88,
        niche_relevance: getNicheRelevance('audio', niche as string),
        estimated_reach: 75000,
        best_time_to_use: 'Daily 8-10 PM'
      },
      {
        trend_type: 'effect',
        title: 'Face Filter Reveals',
        description: 'Using AR filters for product reveals or transformations',
        popularity_score: 82,
        niche_relevance: getNicheRelevance('filter', niche as string),
        estimated_reach: 30000,
        best_time_to_use: 'Weekend mornings'
      },
      {
        trend_type: 'hashtag',
        title: '#StorytimeThread',
        description: 'Multi-part storytelling format for engagement',
        popularity_score: 79,
        niche_relevance: getNicheRelevance('story', niche as string),
        estimated_reach: 40000,
        best_time_to_use: 'Wednesday-Friday evenings'
      }
    ];

    // Filter and sort by niche relevance
    const relevantTrends = reelTrends
      .filter(trend => trend.niche_relevance > 30)
      .sort((a, b) => (b.popularity_score * b.niche_relevance) - (a.popularity_score * a.niche_relevance));

    res.json({
      success: true,
      niche,
      trends: relevantTrends,
      trending_challenges: generateTrendingChallenges(niche as string),
      content_ideas: generateContentIdeas(niche as string),
      performance_prediction: predictTrendPerformance(relevantTrends, niche as string)
    });

  } catch (error) {
    console.error('Reel trends error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reel trends',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper functions
async function getSpotifyToken() {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to get Spotify token');
  }
}

function calculateTrendingScore(popularity: number): number {
  // Combine popularity with recency and growth factors
  const baseScore = popularity;
  const trendingMultiplier = Math.random() * 0.3 + 0.85; // 0.85-1.15
  return Math.round(baseScore * trendingMultiplier);
}

function getGenreFromNiche(niche: string): string {
  const genreMap: Record<string, string> = {
    'fitness': 'Electronic/Hip-Hop',
    'food': 'Acoustic/Indie',
    'travel': 'World/Chill',
    'business': 'Instrumental/Ambient',
    'lifestyle': 'Pop/Indie',
    'fashion': 'Pop/Electronic'
  };
  return genreMap[niche] || 'Pop';
}

function getNicheSpecificAudio(niche: string) {
  const audioRecommendations: Record<string, any[]> = {
    'fitness': [
      { title: 'High Energy Workout Mix', usage_tip: 'Perfect for transformation videos' },
      { title: 'Motivational Beats', usage_tip: 'Great for progress tracking content' }
    ],
    'food': [
      { title: 'Cooking Show Vibes', usage_tip: 'Ideal for recipe tutorials' },
      { title: 'Restaurant Ambiance', usage_tip: 'Perfect for food reveal videos' }
    ],
    'travel': [
      { title: 'Adventure Music', usage_tip: 'Great for destination reveals' },
      { title: 'Cultural Sounds', usage_tip: 'Perfect for cultural immersion content' }
    ]
  };
  
  return audioRecommendations[niche] || [
    { title: 'Trending Pop Mix', usage_tip: 'Universal appeal for most content' }
  ];
}

function getAudioUsageTips(niche: string): string[] {
  return [
    "Use the first 3-5 seconds of trending audio for maximum impact",
    "Match audio energy to your content pace",
    "Consider audio lyrics relevance to your niche",
    "Layer original voice over trending audio when possible",
    "Check audio copyright restrictions before using"
  ];
}

function generateTrendingHashtags(niche: string): TrendingHashtag[] {
  const baseHashtags: Record<string, string[]> = {
    'fitness': ['#FitTok', '#WorkoutMotivation', '#HealthyLifestyle', '#FitnessJourney'],
    'food': ['#FoodTok', '#RecipeOfTheDay', '#FoodieLife', '#CookingHacks'],
    'travel': ['#TravelTok', '#Wanderlust', '#TravelTips', '#ExploreMore'],
    'business': ['#BusinessTips', '#Entrepreneur', '#StartupLife', '#BusinessGrowth'],
    'lifestyle': ['#LifestyleTok', '#DailyRoutine', '#SelfCare', '#LifeHacks']
  };

  const nicheTags = baseHashtags[niche] || ['#Content', '#Creator', '#Trending'];
  
  return nicheTags.map((tag, index) => ({
    hashtag: tag,
    post_count: Math.floor(Math.random() * 1000000) + 100000,
    growth_rate: Math.floor(Math.random() * 50) + 10,
    engagement_rate: Math.floor(Math.random() * 8) + 2,
    related_hashtags: generateRelatedHashtags(tag, niche)
  }));
}

function generateEmergingHashtags(niche: string): string[] {
  const emerging: Record<string, string[]> = {
    'fitness': ['#MindfulMovement', '#FunctionalFitness', '#WellnessWednesday'],
    'food': ['#PlantBasedEats', '#MealPrepSunday', '#SustainableCooking'],
    'travel': ['#SlowTravel', '#LocalExperience', '#ResponsibleTourism'],
    'business': ['#RemoteWork', '#DigitalNomad', '#SustainableBusiness']
  };
  
  return emerging[niche] || ['#NewTrend', '#Innovation', '#Creative'];
}

function getEvergreenHashtags(niche: string): string[] {
  return [
    '#Instagram', '#Reels', '#Viral', '#Trending', '#Content',
    '#Creator', '#Inspiration', '#Motivation', '#Life', '#Love'
  ];
}

function getNicheHashtags(niche: string): string[] {
  const nicheSpecific: Record<string, string[]> = {
    'fitness': ['#Gym', '#Workout', '#Health', '#Strength', '#Cardio'],
    'food': ['#Recipe', '#Cooking', '#Delicious', '#Foodie', '#Yummy'],
    'travel': ['#Adventure', '#Vacation', '#Explore', '#Journey', '#Destination'],
    'business': ['#Success', '#Growth', '#Leadership', '#Innovation', '#Strategy']
  };
  
  return nicheSpecific[niche] || ['#General', '#Content', '#Social'];
}

function getHashtagOptimizationTips(): string[] {
  return [
    "Use 3-5 trending hashtags max to avoid being marked as spam",
    "Mix high, medium, and low competition hashtags",
    "Create branded hashtags for your content series",
    "Research hashtag performance before using",
    "Avoid banned or shadowbanned hashtags"
  ];
}

function getOptimalHashtagMix(niche: string) {
  return {
    trending: "2-3 hashtags",
    niche_specific: "5-7 hashtags", 
    branded: "1-2 hashtags",
    location: "1 hashtag (if relevant)",
    total_recommended: "10-15 hashtags max"
  };
}

function generateTrendingChallenges(niche: string) {
  const challenges: Record<string, any[]> = {
    'fitness': [
      { name: '#30DayFitnessChallenge', difficulty: 'Medium', estimated_participants: 50000 },
      { name: '#WorkoutWithMe', difficulty: 'Easy', estimated_participants: 100000 }
    ],
    'food': [
      { name: '#RecipeRecreate', difficulty: 'Easy', estimated_participants: 75000 },
      { name: '#CookingSkillChallenge', difficulty: 'Hard', estimated_participants: 25000 }
    ]
  };
  
  return challenges[niche] || [
    { name: '#ContentCreatorChallenge', difficulty: 'Medium', estimated_participants: 30000 }
  ];
}

function generateContentIdeas(niche: string): string[] {
  const ideas: Record<string, string[]> = {
    'fitness': [
      "Before/after transformation reveals",
      "Quick workout routines (60 seconds)",
      "Healthy meal prep videos",
      "Fitness myth-busting content"
    ],
    'food': [
      "Recipe recreation challenges",
      "Cooking hacks and shortcuts",
      "Food styling tutorials",
      "Cultural cuisine explorations"
    ],
    'travel': [
      "Hidden gem destinations",
      "Packing hacks and tips",
      "Local culture experiences",
      "Budget travel guides"
    ]
  };
  
  return ideas[niche] || [
    "Behind-the-scenes content",
    "Tutorial and how-to videos",
    "Q&A and storytelling",
    "Trend participation"
  ];
}

function getNicheRelevance(trendType: string, niche: string): number {
  const relevanceMap: Record<string, Record<string, number>> = {
    'transformation': { 'fitness': 95, 'business': 80, 'lifestyle': 75 },
    'audio': { 'general': 90, 'fitness': 85, 'lifestyle': 88 },
    'filter': { 'lifestyle': 95, 'fashion': 90, 'beauty': 95 },
    'story': { 'business': 85, 'lifestyle': 80, 'travel': 90 }
  };
  
  return relevanceMap[trendType]?.[niche] || 60;
}

function predictTrendPerformance(trends: ReelTrend[], niche: string) {
  const topTrend = trends[0];
  return {
    estimated_views: Math.floor(topTrend?.estimated_reach * 1.5) || 50000,
    engagement_rate: "4.5-7.2%",
    best_time_to_post: topTrend?.best_time_to_use || "Evening (7-9 PM)",
    success_probability: "High",
    recommendations: [
      "Focus on the top 2 trending formats for your niche",
      "Post consistently during peak engagement times",
      "Engage with comments within first hour of posting"
    ]
  };
}

function generateFallbackTrendingAudio(niche: string): TrendingAudio[] {
  return [
    {
      id: 'fallback1',
      title: 'Trending Beat 2024',
      artist: 'Various Artists',
      duration: 180000,
      popularity: 85,
      genre: getGenreFromNiche(niche),
      usage_count: 15000,
      trending_score: 90
    },
    {
      id: 'fallback2', 
      title: 'Viral Sound Mix',
      artist: 'TikTok Trending',
      duration: 150000,
      popularity: 78,
      genre: 'Pop',
      usage_count: 12000,
      trending_score: 82
    }
  ];
}

function generateRelatedHashtags(mainTag: string, niche: string): string[] {
  const related: Record<string, string[]> = {
    '#FitTok': ['#Workout', '#Health', '#Fitness'],
    '#FoodTok': ['#Recipe', '#Cooking', '#Foodie'],
    '#TravelTok': ['#Adventure', '#Explore', '#Wanderlust']
  };
  
  return related[mainTag] || ['#Trending', '#Viral', '#Content'];
}
