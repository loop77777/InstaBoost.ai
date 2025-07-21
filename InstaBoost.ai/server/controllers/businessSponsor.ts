import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

interface BusinessSponsor {
  _id?: ObjectId;
  businessId: string;
  name: string;
  logo: string;
  category: string;
  budget: number;
  description?: string;
  activeInfluencers: number;
  campaignStatus: 'active' | 'paused' | 'completed';
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
    lastUpdated: Date;
  };
  dateAdded: Date;
  lastActivity: Date;
  isActive: boolean;
}

interface InfluencerPartnership {
  _id?: ObjectId;
  businessId: string;
  sponsorId: string;
  influencerId: string;
  influencerName: string;
  influencerHandle: string;
  followers: number;
  engagementRate: number;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  campaignResults: {
    posts: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    lastUpdated: Date;
  };
  contractDetails: {
    startDate: Date;
    endDate: Date;
    deliverables: string[];
    budget: number;
    paymentStatus: 'pending' | 'paid' | 'partial';
  };
  performanceMetrics: {
    averageEngagement: number;
    clickThroughRate: number;
    conversionRate: number;
    brandMentions: number;
  };
  dateCreated: Date;
  lastUpdated: Date;
}

interface CommunityGrowthMetrics {
  totalBusinesses: number;
  activeSponsors: number;
  totalPartnerships: number;
  inactivePartnerships: number;
  communityHealthScore: number;
  growthTrends: {
    weeklyGrowth: number;
    monthlyGrowth: number;
    partnershipRetention: number;
  };
}

class BusinessSponsorController {
  
  /**
   * Get all sponsors for a business
   */
  async getBusinessSponsors(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { status, category, sortBy = 'dateAdded', order = 'desc' } = req.query;

      // Build filter query
      const filter: any = { businessId, isActive: true };
      if (status) filter.campaignStatus = status;
      if (category) filter.category = category;

      // Build sort query
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortQuery: any = {};
      sortQuery[sortBy as string] = sortOrder;

      const sponsors = await this.getSponsorCollection().find(filter)
        .sort(sortQuery)
        .toArray();

      // Calculate summary metrics
      const summary = {
        totalSponsors: sponsors.length,
        activeSponsors: sponsors.filter(s => s.campaignStatus === 'active').length,
        totalBudget: sponsors.reduce((sum, s) => sum + s.budget, 0),
        totalInfluencers: sponsors.reduce((sum, s) => sum + s.activeInfluencers, 0),
        totalReach: sponsors.reduce((sum, s) => sum + s.performance.reach, 0),
        averageROI: sponsors.length > 0 ? 
          sponsors.reduce((sum, s) => sum + s.performance.roi, 0) / sponsors.length : 0
      };

      res.json({
        success: true,
        data: {
          sponsors,
          summary
        }
      });
    } catch (error) {
      console.error('Error fetching business sponsors:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sponsors',
        error: error.message
      });
    }
  }

  /**
   * Add a new sponsor
   */
  async addSponsor(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { name, logo, category, budget, description } = req.body;

      // Validate required fields
      if (!name || !category || !budget) {
        return res.status(400).json({
          success: false,
          message: 'Name, category, and budget are required'
        });
      }

      const newSponsor: BusinessSponsor = {
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
          roi: 0,
          lastUpdated: new Date()
        },
        dateAdded: new Date(),
        lastActivity: new Date(),
        isActive: true
      };

      const result = await this.getSponsorCollection().insertOne(newSponsor);

      res.status(201).json({
        success: true,
        message: 'Sponsor added successfully',
        data: {
          sponsorId: result.insertedId,
          sponsor: newSponsor
        }
      });
    } catch (error) {
      console.error('Error adding sponsor:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add sponsor',
        error: error.message
      });
    }
  }

  /**
   * Update sponsor information
   */
  async updateSponsor(req: Request, res: Response) {
    try {
      const { businessId, sponsorId } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.businessId;
      delete updateData.dateAdded;

      updateData.lastActivity = new Date();

      const result = await this.getSponsorCollection().updateOne(
        { _id: new ObjectId(sponsorId), businessId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor not found'
        });
      }

      res.json({
        success: true,
        message: 'Sponsor updated successfully'
      });
    } catch (error) {
      console.error('Error updating sponsor:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update sponsor',
        error: error.message
      });
    }
  }

  /**
   * Remove/deactivate a sponsor
   */
  async removeSponsor(req: Request, res: Response) {
    try {
      const { businessId, sponsorId } = req.params;
      const { permanent = false } = req.query;

      if (permanent === 'true') {
        // Permanently delete the sponsor
        const result = await this.getSponsorCollection().deleteOne({
          _id: new ObjectId(sponsorId),
          businessId
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Sponsor not found'
          });
        }

        // Also remove associated partnerships
        await this.getPartnershipCollection().deleteMany({
          businessId,
          sponsorId
        });
      } else {
        // Soft delete - mark as inactive
        const result = await this.getSponsorCollection().updateOne(
          { _id: new ObjectId(sponsorId), businessId },
          { 
            $set: { 
              isActive: false, 
              campaignStatus: 'completed',
              lastActivity: new Date()
            } 
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Sponsor not found'
          });
        }
      }

      res.json({
        success: true,
        message: 'Sponsor removed successfully'
      });
    } catch (error) {
      console.error('Error removing sponsor:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove sponsor',
        error: error.message
      });
    }
  }

  /**
   * Get influencer partnerships for a business
   */
  async getInfluencerPartnerships(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { status, sponsorId, includeInactive = 'true' } = req.query;

      const filter: any = { businessId };
      if (status) filter.status = status;
      if (sponsorId) filter.sponsorId = sponsorId;

      const partnerships = await this.getPartnershipCollection()
        .find(filter)
        .sort({ lastUpdated: -1 })
        .toArray();

      // Identify inactive partnerships for removal suggestions
      const inactivePartnerships = partnerships.filter(p => 
        p.status === 'inactive' || 
        (p.contractDetails.endDate < new Date() && p.status !== 'completed')
      );

      // Calculate partnership health metrics
      const healthMetrics = {
        totalPartnerships: partnerships.length,
        activePartnerships: partnerships.filter(p => p.status === 'active').length,
        inactivePartnerships: inactivePartnerships.length,
        averageEngagement: partnerships.length > 0 ? 
          partnerships.reduce((sum, p) => sum + p.performanceMetrics.averageEngagement, 0) / partnerships.length : 0,
        removalSuggestions: inactivePartnerships.map(p => ({
          partnershipId: p._id,
          influencerName: p.influencerName,
          reason: this.getRemovalReason(p),
          potentialImpact: this.calculateRemovalImpact(p)
        }))
      };

      res.json({
        success: true,
        data: {
          partnerships: includeInactive === 'true' ? partnerships : 
            partnerships.filter(p => p.status !== 'inactive'),
          healthMetrics
        }
      });
    } catch (error) {
      console.error('Error fetching partnerships:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch partnerships',
        error: error.message
      });
    }
  }

  /**
   * Remove inactive partnerships to improve community growth
   */
  async removeInactivePartnerships(req: Request, res: Response) {
    try {
      const { businessId } = req.params;
      const { partnershipIds, autoRemove = false } = req.body;

      let partnershipsToRemove = [];

      if (autoRemove) {
        // Automatically identify and remove inactive partnerships
        const inactiveFilter = {
          businessId,
          $or: [
            { status: 'inactive' },
            { 
              'contractDetails.endDate': { $lt: new Date() },
              status: { $ne: 'completed' }
            },
            {
              'performanceMetrics.averageEngagement': { $lt: 1 }, // Less than 1% engagement
              'campaignResults.lastUpdated': { 
                $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // No activity in 30 days
              }
            }
          ]
        };

        partnershipsToRemove = await this.getPartnershipCollection()
          .find(inactiveFilter)
          .toArray();
      } else if (partnershipIds && partnershipIds.length > 0) {
        // Remove specific partnerships
        partnershipsToRemove = await this.getPartnershipCollection()
          .find({
            _id: { $in: partnershipIds.map(id => new ObjectId(id)) },
            businessId
          })
          .toArray();
      }

      if (partnershipsToRemove.length === 0) {
        return res.json({
          success: true,
          message: 'No inactive partnerships found to remove',
          data: { removedCount: 0 }
        });
      }

      // Calculate impact before removal
      const impactAnalysis = {
        totalReachLoss: partnershipsToRemove.reduce((sum, p) => sum + p.campaignResults.reach, 0),
        budgetSaved: partnershipsToRemove.reduce((sum, p) => sum + p.contractDetails.budget, 0),
        communityHealthImprovement: this.calculateCommunityHealthImprovement(partnershipsToRemove)
      };

      // Remove the partnerships
      const removalResult = await this.getPartnershipCollection().deleteMany({
        _id: { $in: partnershipsToRemove.map(p => p._id) }
      });

      // Update sponsor active influencer counts
      await this.updateSponsorInfluencerCounts(businessId);

      res.json({
        success: true,
        message: `Successfully removed ${removalResult.deletedCount} inactive partnerships`,
        data: {
          removedCount: removalResult.deletedCount,
          impactAnalysis,
          removedPartnerships: partnershipsToRemove.map(p => ({
            influencerName: p.influencerName,
            reason: this.getRemovalReason(p)
          }))
        }
      });
    } catch (error) {
      console.error('Error removing inactive partnerships:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove inactive partnerships',
        error: error.message
      });
    }
  }

  /**
   * Get community growth analytics
   */
  async getCommunityGrowthAnalytics(req: Request, res: Response) {
    try {
      const { businessId } = req.params;

      // Get current metrics
      const sponsors = await this.getSponsorCollection()
        .find({ businessId, isActive: true })
        .toArray();

      const partnerships = await this.getPartnershipCollection()
        .find({ businessId })
        .toArray();

      const activePartnerships = partnerships.filter(p => p.status === 'active');
      const inactivePartnerships = partnerships.filter(p => p.status === 'inactive');

      // Calculate growth trends
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const weeklyNewPartnerships = partnerships.filter(p => p.dateCreated >= sevenDaysAgo).length;
      const monthlyNewPartnerships = partnerships.filter(p => p.dateCreated >= thirtyDaysAgo).length;

      const communityMetrics: CommunityGrowthMetrics = {
        totalBusinesses: 1, // Current business
        activeSponsors: sponsors.filter(s => s.campaignStatus === 'active').length,
        totalPartnerships: partnerships.length,
        inactivePartnerships: inactivePartnerships.length,
        communityHealthScore: this.calculateCommunityHealthScore(sponsors, partnerships),
        growthTrends: {
          weeklyGrowth: weeklyNewPartnerships,
          monthlyGrowth: monthlyNewPartnerships,
          partnershipRetention: this.calculatePartnershipRetention(partnerships)
        }
      };

      // Generate recommendations
      const recommendations = this.generateGrowthRecommendations(sponsors, partnerships);

      res.json({
        success: true,
        data: {
          metrics: communityMetrics,
          recommendations,
          insights: {
            topPerformingSponsors: sponsors
              .sort((a, b) => b.performance.roi - a.performance.roi)
              .slice(0, 3),
            underperformingPartnerships: partnerships
              .filter(p => p.performanceMetrics.averageEngagement < 2)
              .slice(0, 5),
            budgetOptimization: this.generateBudgetOptimization(sponsors, partnerships)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching community growth analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch community growth analytics',
        error: error.message
      });
    }
  }

  // Helper methods
  private getRemovalReason(partnership: InfluencerPartnership): string {
    if (partnership.status === 'inactive') {
      return 'Partnership marked as inactive';
    }
    if (partnership.contractDetails.endDate < new Date()) {
      return 'Contract expired';
    }
    if (partnership.performanceMetrics.averageEngagement < 1) {
      return 'Low engagement rate (< 1%)';
    }
    return 'No recent activity';
  }

  private calculateRemovalImpact(partnership: InfluencerPartnership) {
    return {
      reachLoss: partnership.campaignResults.reach,
      budgetSaved: partnership.contractDetails.budget,
      engagementImpact: partnership.campaignResults.engagement
    };
  }

  private calculateCommunityHealthImprovement(removedPartnerships: InfluencerPartnership[]): number {
    // Calculate improvement based on removing low-performing partnerships
    const avgEngagement = removedPartnerships.reduce((sum, p) => 
      sum + p.performanceMetrics.averageEngagement, 0) / removedPartnerships.length;
    
    // Lower engagement partnerships removal = higher health improvement
    return Math.max(0, (5 - avgEngagement) * 10); // Score out of 50
  }

  private calculateCommunityHealthScore(sponsors: BusinessSponsor[], partnerships: InfluencerPartnership[]): number {
    if (partnerships.length === 0) return 0;

    const activePartnershipRatio = partnerships.filter(p => p.status === 'active').length / partnerships.length;
    const avgEngagement = partnerships.reduce((sum, p) => sum + p.performanceMetrics.averageEngagement, 0) / partnerships.length;
    const avgROI = sponsors.reduce((sum, s) => sum + s.performance.roi, 0) / sponsors.length;

    // Score out of 100
    return Math.min(100, (activePartnershipRatio * 30) + (avgEngagement * 5) + (avgROI * 10));
  }

  private calculatePartnershipRetention(partnerships: InfluencerPartnership[]): number {
    const completedPartnerships = partnerships.filter(p => p.status === 'completed');
    const totalPartnerships = partnerships.length;
    
    if (totalPartnerships === 0) return 0;
    return (completedPartnerships.length / totalPartnerships) * 100;
  }

  private generateGrowthRecommendations(sponsors: BusinessSponsor[], partnerships: InfluencerPartnership[]) {
    const recommendations = [];

    // Check for inactive partnerships
    const inactiveCount = partnerships.filter(p => p.status === 'inactive').length;
    if (inactiveCount > 0) {
      recommendations.push({
        type: 'optimization',
        title: 'Remove Inactive Partnerships',
        description: `You have ${inactiveCount} inactive partnerships that could be removed to improve community growth`,
        priority: 'high',
        action: 'remove_inactive'
      });
    }

    // Check for low-performing sponsors
    const lowROISponsors = sponsors.filter(s => s.performance.roi < 1.5).length;
    if (lowROISponsors > 0) {
      recommendations.push({
        type: 'budget',
        title: 'Optimize Sponsor Budgets',
        description: `${lowROISponsors} sponsors have ROI below 1.5x. Consider reallocating budget`,
        priority: 'medium',
        action: 'optimize_budget'
      });
    }

    // Check for engagement opportunities
    const avgEngagement = partnerships.reduce((sum, p) => sum + p.performanceMetrics.averageEngagement, 0) / partnerships.length;
    if (avgEngagement < 3) {
      recommendations.push({
        type: 'engagement',
        title: 'Improve Engagement Rates',
        description: 'Focus on micro-influencers with higher engagement rates for better community growth',
        priority: 'medium',
        action: 'improve_engagement'
      });
    }

    return recommendations;
  }

  private generateBudgetOptimization(sponsors: BusinessSponsor[], partnerships: InfluencerPartnership[]) {
    return {
      totalBudget: sponsors.reduce((sum, s) => sum + s.budget, 0),
      recommendedReallocation: sponsors.map(sponsor => ({
        sponsorId: sponsor._id,
        currentBudget: sponsor.budget,
        recommendedBudget: this.calculateOptimalBudget(sponsor, partnerships),
        reasoning: this.getBudgetReasoning(sponsor, partnerships)
      }))
    };
  }

  private calculateOptimalBudget(sponsor: BusinessSponsor, partnerships: InfluencerPartnership[]): number {
    const sponsorPartnerships = partnerships.filter(p => p.sponsorId === sponsor._id?.toString());
    if (sponsorPartnerships.length === 0) return sponsor.budget;

    const avgROI = sponsorPartnerships.reduce((sum, p) => sum + p.performanceMetrics.conversionRate, 0) / sponsorPartnerships.length;
    
    // Adjust budget based on ROI
    if (avgROI > 3) return sponsor.budget * 1.2; // Increase by 20%
    if (avgROI < 1.5) return sponsor.budget * 0.8; // Decrease by 20%
    return sponsor.budget;
  }

  private getBudgetReasoning(sponsor: BusinessSponsor, partnerships: InfluencerPartnership[]): string {
    if (sponsor.performance.roi > 3) return 'High ROI - consider increasing budget';
    if (sponsor.performance.roi < 1.5) return 'Low ROI - consider reducing budget';
    return 'Performance is optimal - maintain current budget';
  }

  private async updateSponsorInfluencerCounts(businessId: string) {
    const sponsors = await this.getSponsorCollection().find({ businessId }).toArray();
    
    for (const sponsor of sponsors) {
      const activeInfluencerCount = await this.getPartnershipCollection().countDocuments({
        businessId,
        sponsorId: sponsor._id?.toString(),
        status: 'active'
      });

      await this.getSponsorCollection().updateOne(
        { _id: sponsor._id },
        { $set: { activeInfluencers: activeInfluencerCount } }
      );
    }
  }

  // Database connection methods (implement based on your MongoDB setup)
  private getSponsorCollection() {
    // Return your MongoDB collection for sponsors
    // This should be implemented based on your database connection setup
  }

  private getPartnershipCollection() {
    // Return your MongoDB collection for partnerships
    // This should be implemented based on your database connection setup
  }
}

export default new BusinessSponsorController();
