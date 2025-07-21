import { Request, Response } from 'express';
import OpenAI from 'openai';
import { getCaptionPrompt, getHashtagPrompt, CaptionRequest } from '../../ai/captionPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCaption = async (req: Request, res: Response) => {
  try {
    const captionRequest: CaptionRequest = req.body;
    
    // Validate required fields
    if (!captionRequest.topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = getCaptionPrompt(captionRequest);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert Instagram content creator and social media strategist."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let captionData;
    try {
      captionData = JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      captionData = {
        caption: response,
        hashtags: [],
        suggestedTags: [],
        engagementScore: 75
      };
    }

    res.json({
      success: true,
      data: captionData,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate caption',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const generateHashtags = async (req: Request, res: Response) => {
  try {
    const { niche, postType } = req.body;
    
    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }

    const prompt = getHashtagPrompt(niche, postType || 'photo');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a hashtag research expert specializing in Instagram growth."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let hashtags;
    try {
      hashtags = JSON.parse(response);
    } catch (parseError) {
      // Fallback parsing
      hashtags = response.split(/[\s,#]+/).filter(tag => tag.length > 0);
    }

    res.json({
      success: true,
      hashtags: hashtags,
      niche: niche,
      postType: postType || 'photo'
    });

  } catch (error) {
    console.error('Hashtag generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate hashtags',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const analyzePost = async (req: Request, res: Response) => {
  try {
    const { caption, imageUrl } = req.body;
    
    if (!caption) {
      return res.status(400).json({ error: 'Caption is required for analysis' });
    }

    const analysisPrompt = `
    Analyze this Instagram caption for engagement potential and provide suggestions:
    
    Caption: "${caption}"
    
    Provide analysis in JSON format:
    {
      "engagementScore": 85,
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "suggestedHashtags": ["hashtag1", "hashtag2"],
      "bestPostingTime": "7:00 PM",
      "audienceMatch": "high/medium/low"
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an Instagram analytics expert who provides actionable insights."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch (parseError) {
      analysis = {
        engagementScore: 75,
        strengths: ["Well written caption"],
        improvements: ["Could use more engaging hooks"],
        suggestedHashtags: ["#instagram", "#content"],
        bestPostingTime: "7:00 PM",
        audienceMatch: "medium"
      };
    }

    res.json({
      success: true,
      analysis: analysis,
      originalCaption: caption
    });

  } catch (error) {
    console.error('Post analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};