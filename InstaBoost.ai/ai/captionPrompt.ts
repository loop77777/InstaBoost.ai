export interface CaptionRequest {
  topic: string;
  tone: 'casual' | 'professional' | 'funny' | 'inspirational' | 'educational';
  audience: 'general' | 'business' | 'lifestyle' | 'fitness' | 'food' | 'travel';
  hashtags: boolean;
  length: 'short' | 'medium' | 'long';
  includeEmojis: boolean;
  includeCall2Action: boolean;
}

export interface CaptionResponse {
  caption: string;
  hashtags: string[];
  suggestedTags: string[];
  engagementScore: number;
}

export const getCaptionPrompt = (request: CaptionRequest): string => {
  const { topic, tone, audience, hashtags, length, includeEmojis, includeCall2Action } = request;
  
  const lengthGuide = {
    short: '50-100 characters',
    medium: '100-200 characters', 
    long: '200-500 characters'
  };

  const toneGuide = {
    casual: 'friendly, conversational, and relatable',
    professional: 'polished, authoritative, and business-appropriate',
    funny: 'humorous, witty, and entertaining',
    inspirational: 'motivating, uplifting, and encouraging',
    educational: 'informative, helpful, and instructive'
  };

  return `
You are an expert Instagram content creator specializing in viral captions. Create an engaging Instagram caption with the following requirements:

**Topic:** ${topic}
**Tone:** ${toneGuide[tone]}
**Target Audience:** ${audience}
**Length:** ${lengthGuide[length]}
**Include Emojis:** ${includeEmojis ? 'Yes' : 'No'}
**Include Call-to-Action:** ${includeCall2Action ? 'Yes' : 'No'}
**Include Hashtags:** ${hashtags ? 'Yes (provide 10-15 relevant hashtags)' : 'No'}

**Instructions:**
1. Write a compelling caption that encourages engagement
2. Use storytelling or hook techniques to grab attention
3. Make it authentic and relatable to the target audience
4. ${includeCall2Action ? 'Include a clear call-to-action (like, comment, share, save)' : ''}
5. ${includeEmojis ? 'Use relevant emojis strategically throughout' : 'Avoid using emojis'}
6. ${hashtags ? 'Provide hashtags separated by spaces at the end' : ''}

**Format your response as JSON:**
{
  "caption": "Your engaging caption here",
  "hashtags": ["hashtag1", "hashtag2", "..."],
  "suggestedTags": ["additional_tag1", "additional_tag2", "..."],
  "engagementScore": 85
}

The engagement score should be 1-100 based on how likely this caption is to drive engagement.
`;
};

export const getHashtagPrompt = (niche: string, postType: 'photo' | 'reel' | 'story'): string => {
  return `
Generate 20 high-performing Instagram hashtags for a ${postType} post in the ${niche} niche.

Mix of:
- 5 high-volume hashtags (1M+ posts)
- 10 medium-volume hashtags (100K-1M posts)  
- 5 low-volume hashtags (10K-100K posts)

Focus on hashtags that are:
- Currently trending
- Relevant to ${niche}
- Have good engagement rates
- Not overly saturated

Return as a JSON array: ["hashtag1", "hashtag2", ...]
`;
};

export const getTrendAnalysisPrompt = (captions: string[]): string => {
  return `
Analyze these Instagram captions and identify trending patterns, themes, and engagement drivers:

${captions.map((caption, index) => `Caption ${index + 1}: ${caption}`).join('\n\n')}

Provide analysis in JSON format:
{
  "trendingThemes": ["theme1", "theme2", "..."],
  "popularEmojis": ["😍", "🔥", "..."],
  "engagementDrivers": ["question", "call-to-action", "..."],
  "recommendedTone": "casual/professional/funny",
  "bestPostingTimes": ["9AM", "7PM", "..."],
  "hashtagRecommendations": ["hashtag1", "hashtag2", "..."]
}
`;
};