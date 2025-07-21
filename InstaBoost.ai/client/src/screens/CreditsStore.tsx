import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ProgressBarAndroid,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus_credits: number;
  popular: boolean;
  features: string[];
}

interface UserCredits {
  current_credits: number;
  used_this_month: number;
  plan_limit: number;
  expires_at?: string;
  subscription_plan: 'free' | 'pro' | 'premium';
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  credit_cost: number;
  category: 'ai' | 'analytics' | 'automation' | 'collaboration';
  icon: string;
  available_in: ('free' | 'pro' | 'premium')[];
}

const CreditsStore: React.FC = () => {
  const [userCredits, setUserCredits] = useState<UserCredits>({
    current_credits: 25,
    used_this_month: 47,
    plan_limit: 100,
    subscription_plan: 'pro'
  });

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate progress bar
    Animated.timing(animatedValue, {
      toValue: userCredits.used_this_month / userCredits.plan_limit,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [userCredits]);

  const creditPackages: CreditPackage[] = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: 9.99,
      bonus_credits: 5,
      popular: false,
      features: [
        '50 AI Caption generations',
        '5 Bonus credits',
        'Valid for 30 days',
        'All AI features'
      ]
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      credits: 150,
      price: 24.99,
      bonus_credits: 25,
      popular: true,
      features: [
        '150 AI Caption generations',
        '25 Bonus credits',
        'Valid for 60 days',
        'All AI features',
        'Priority processing'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 500,
      price: 69.99,
      bonus_credits: 100,
      popular: false,
      features: [
        '500 AI Caption generations',
        '100 Bonus credits',
        'Valid for 90 days',
        'All AI features',
        'Priority processing',
        'Advanced AI models'
      ]
    },
    {
      id: 'unlimited',
      name: 'Unlimited Monthly',
      credits: -1,
      price: 149.99,
      bonus_credits: 0,
      popular: false,
      features: [
        'Unlimited AI generations',
        'All premium features',
        'Advanced AI models',
        'Priority support',
        'Custom integrations'
      ]
    }
  ];

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'ai_caption_generation',
      name: 'AI Caption Generation',
      description: 'Generate viral captions with hashtags using advanced AI',
      credit_cost: 1,
      category: 'ai',
      icon: 'text',
      available_in: ['free', 'pro', 'premium']
    },
    {
      id: 'advanced_caption_analysis',
      name: 'Caption Performance Analysis',
      description: 'Analyze caption effectiveness and get improvement suggestions',
      credit_cost: 2,
      category: 'ai',
      icon: 'analytics',
      available_in: ['pro', 'premium']
    },
    {
      id: 'ai_hashtag_research',
      name: 'AI Hashtag Research',
      description: 'Find trending and relevant hashtags for maximum reach',
      credit_cost: 1,
      category: 'ai',
      icon: 'hash',
      available_in: ['free', 'pro', 'premium']
    },
    {
      id: 'content_idea_generator',
      name: 'Content Idea Generator',
      description: 'Get personalized content ideas based on your niche',
      credit_cost: 2,
      category: 'ai',
      icon: 'bulb',
      available_in: ['pro', 'premium']
    },
    {
      id: 'competitor_analysis',
      name: 'Competitor Analysis',
      description: 'Analyze competitor strategies and get insights',
      credit_cost: 3,
      category: 'analytics',
      icon: 'people',
      available_in: ['pro', 'premium']
    },
    {
      id: 'audience_insights',
      name: 'Advanced Audience Insights',
      description: 'Deep dive into your audience demographics and behavior',
      credit_cost: 2,
      category: 'analytics',
      icon: 'pie-chart',
      available_in: ['pro', 'premium']
    },
    {
      id: 'auto_dm_responses',
      name: 'Auto DM Responses',
      description: 'AI-powered automatic responses to direct messages',
      credit_cost: 5,
      category: 'automation',
      icon: 'chatbubbles',
      available_in: ['premium']
    },
    {
      id: 'smart_scheduling',
      name: 'Smart Post Scheduling',
      description: 'AI determines optimal posting times for maximum engagement',
      credit_cost: 1,
      category: 'automation',
      icon: 'time',
      available_in: ['pro', 'premium']
    },
    {
      id: 'collab_matching',
      name: 'AI Collaboration Matching',
      description: 'Find perfect collaboration partners using AI matching',
      credit_cost: 3,
      category: 'collaboration',
      icon: 'people-circle',
      available_in: ['pro', 'premium']
    },
    {
      id: 'campaign_optimization',
      name: 'Campaign Optimization',
      description: 'AI-powered optimization for influencer campaigns',
      credit_cost: 4,
      category: 'collaboration',
      icon: 'trending-up',
      available_in: ['premium']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', icon: 'apps' },
    { id: 'ai', name: 'AI Tools', icon: 'sparkles' },
    { id: 'analytics', name: 'Analytics', icon: 'bar-chart' },
    { id: 'automation', name: 'Automation', icon: 'cog' },
    { id: 'collaboration', name: 'Collaboration', icon: 'people' }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? premiumFeatures 
    : premiumFeatures.filter(feature => feature.category === selectedCategory);

  const purchaseCredits = (packageData: CreditPackage) => {
    Alert.alert(
      'Purchase Credits',
      `Purchase ${packageData.credits === -1 ? 'Unlimited' : packageData.credits + packageData.bonus_credits} credits for $${packageData.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Purchase', onPress: () => processPurchase(packageData) }
      ]
    );
  };

  const processPurchase = (packageData: CreditPackage) => {
    // Simulate purchase process
    const newCredits = packageData.credits === -1 
      ? 9999 
      : userCredits.current_credits + packageData.credits + packageData.bonus_credits;
    
    setUserCredits(prev => ({
      ...prev,
      current_credits: newCredits
    }));

    setShowPurchaseModal(false);
    Alert.alert('Success', `${packageData.credits === -1 ? 'Unlimited' : packageData.credits + packageData.bonus_credits} credits added to your account!`);
  };

  const useFeature = (feature: PremiumFeature) => {
    if (userCredits.current_credits < feature.credit_cost) {
      Alert.alert(
        'Insufficient Credits',
        `You need ${feature.credit_cost} credits to use this feature. You have ${userCredits.current_credits} credits remaining.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy Credits', onPress: () => setShowPurchaseModal(true) }
        ]
      );
      return;
    }

    Alert.alert(
      'Use Feature',
      `Use ${feature.name} for ${feature.credit_cost} credits?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Feature', onPress: () => processFeatureUse(feature) }
      ]
    );
  };

  const processFeatureUse = (feature: PremiumFeature) => {
    setUserCredits(prev => ({
      ...prev,
      current_credits: prev.current_credits - feature.credit_cost,
      used_this_month: prev.used_this_month + feature.credit_cost
    }));

    Alert.alert('Success', `${feature.name} activated!`);
  };

  const getUsagePercentage = () => {
    return (userCredits.used_this_month / userCredits.plan_limit) * 100;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Credits & Premium</Text>
        <TouchableOpacity onPress={() => setShowPurchaseModal(true)}>
          <Ionicons name="add-circle" size={24} color="#E1306C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Credits Overview */}
        <View style={styles.creditsOverview}>
          <View style={styles.creditsCard}>
            <View style={styles.creditsHeader}>
              <View>
                <Text style={styles.creditsTitle}>Available Credits</Text>
                <Text style={styles.creditsValue}>{userCredits.current_credits.toLocaleString()}</Text>
              </View>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>{userCredits.subscription_plan.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.usageContainer}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageLabel}>Monthly Usage</Text>
                <Text style={styles.usageValue}>
                  {userCredits.used_this_month} / {userCredits.plan_limit === -1 ? '∞' : userCredits.plan_limit}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBar,
                      {
                        width: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        }),
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(getUsagePercentage())}%</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.buyCreditsButton}
              onPress={() => setShowPurchaseModal(true)}
            >
              <Ionicons name="diamond" size={16} color="white" />
              <Text style={styles.buyCreditsText}>Buy More Credits</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.id ? 'white' : '#666'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Premium Features */}
        <View style={styles.featuresContainer}>
          {filteredFeatures.map(feature => (
            <TouchableOpacity 
              key={feature.id} 
              style={styles.featureCard}
              onPress={() => useFeature(feature)}
            >
              <View style={styles.featureHeader}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color="#E1306C" />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureName}>{feature.name}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <View style={styles.featureCost}>
                  <Text style={styles.costValue}>{feature.credit_cost}</Text>
                  <Text style={styles.costLabel}>credits</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <View style={styles.planAvailability}>
                  {feature.available_in.map(plan => (
                    <View key={plan} style={[styles.planChip, { backgroundColor: getPlanColor(plan) }]}>
                      <Text style={styles.planChipText}>{plan.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.useButton}>
                  <Text style={styles.useButtonText}>Use Feature</Text>
                  <Ionicons name="chevron-forward" size={16} color="#E1306C" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credit History */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="text" size={16} color="#4CAF50" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAction}>AI Caption Generated</Text>
                <Text style={styles.historyTime}>2 hours ago</Text>
              </View>
              <Text style={styles.historyCost}>-1 credit</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="analytics" size={16} color="#2196F3" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAction}>Caption Analysis</Text>
                <Text style={styles.historyTime}>5 hours ago</Text>
              </View>
              <Text style={styles.historyCost}>-2 credits</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="diamond" size={16} color="#FFD700" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAction}>Credits Purchased</Text>
                <Text style={styles.historyTime}>1 day ago</Text>
              </View>
              <Text style={[styles.historyCost, { color: '#4CAF50' }]}>+50 credits</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal visible={showPurchaseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy AI Credits</Text>
              <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.packagesContainer}>
              {creditPackages.map(packageData => (
                <TouchableOpacity 
                  key={packageData.id} 
                  style={[
                    styles.packageCard,
                    packageData.popular && styles.popularPackage
                  ]}
                  onPress={() => purchaseCredits(packageData)}
                >
                  {packageData.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}

                  <View style={styles.packageHeader}>
                    <Text style={styles.packageName}>{packageData.name}</Text>
                    <Text style={styles.packagePrice}>{formatPrice(packageData.price)}</Text>
                  </View>

                  <View style={styles.creditsInfo}>
                    <Text style={styles.mainCredits}>
                      {packageData.credits === -1 ? 'Unlimited' : packageData.credits.toLocaleString()} credits
                    </Text>
                    {packageData.bonus_credits > 0 && (
                      <Text style={styles.bonusCredits}>+ {packageData.bonus_credits} bonus</Text>
                    )}
                  </View>

                  <View style={styles.packageFeatures}>
                    {packageData.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Ionicons name="checkmark" size={16} color="#4CAF50" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.purchaseButton}>
                    <Text style={styles.purchaseButtonText}>Purchase</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  function getPlanColor(plan: string): string {
    switch (plan) {
      case 'free': return '#9E9E9E';
      case 'pro': return '#E1306C';
      case 'premium': return '#FFD700';
      default: return '#9E9E9E';
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  creditsOverview: {
    padding: 20,
  },
  creditsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  creditsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  creditsTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  planBadge: {
    backgroundColor: '#E1306C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  usageContainer: {
    marginBottom: 20,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 14,
    color: '#666',
  },
  usageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E1306C',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  buyCreditsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1306C',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  buyCreditsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#E1306C',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featureCost: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
  },
  costValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E1306C',
  },
  costLabel: {
    fontSize: 10,
    color: '#666',
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planAvailability: {
    flexDirection: 'row',
    gap: 6,
  },
  planChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  planChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  useButtonText: {
    color: '#E1306C',
    fontWeight: '600',
    fontSize: 14,
  },
  historyContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packagesContainer: {
    maxHeight: 500,
  },
  packageCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  popularPackage: {
    borderColor: '#E1306C',
    backgroundColor: 'white',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#E1306C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1306C',
  },
  creditsInfo: {
    marginBottom: 12,
  },
  mainCredits: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bonusCredits: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  packageFeatures: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
  purchaseButton: {
    backgroundColor: '#E1306C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CreditsStore;
