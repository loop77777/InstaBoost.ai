import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  instagramId: string;
  username: string;
  email?: string;
  displayName: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken?: string;
  isBusinessAccount: boolean;
  followersCount: number;
  followingCount: number;
  mediaCount: number;
  lastSync: Date;
  accountType: 'personal' | 'business' | 'creator';
  subscription: {
    plan: 'free' | 'pro' | 'premium';
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'canceling';
    expiresAt?: Date;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    trialEnd?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    features: string[];
    aiCreditsUsed: number;
    postsScheduled: number;
    collaborationsFound: number;
  };
  analytics: {
    totalEngagementRate: number;
    averageLikes: number;
    averageComments: number;
    bestPostingTime: string;
    topHashtags: string[];
  };
  settings: {
    autoFollowEnabled: boolean;
    maxFollowsPerDay: number;
    unfollowAfterDays: number;
    targetAccounts: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  instagramId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  isBusinessAccount: {
    type: Boolean,
    default: false
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  mediaCount: {
    type: Number,
    default: 0
  },
  lastSync: {
    type: Date,
    default: Date.now
  },
  accountType: {
    type: String,
    enum: ['personal', 'business', 'creator'],
    default: 'personal'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'canceling'],
      default: 'active'
    },
    expiresAt: Date,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    features: [{
      type: String
    }],
    aiCreditsUsed: {
      type: Number,
      default: 0
    },
    postsScheduled: {
      type: Number,
      default: 0
    },
    collaborationsFound: {
      type: Number,
      default: 0
    }
  },
  analytics: {
    totalEngagementRate: {
      type: Number,
      default: 0
    },
    averageLikes: {
      type: Number,
      default: 0
    },
    averageComments: {
      type: Number,
      default: 0
    },
    bestPostingTime: {
      type: String,
      default: '12:00'
    },
    topHashtags: [{
      type: String
    }]
  },
  settings: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    privacyMode: {
      type: Boolean,
      default: false
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
UserSchema.index({ instagramId: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'subscription.plan': 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);