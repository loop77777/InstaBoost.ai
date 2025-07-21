import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Influencer {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  engagement_rate: number;
  niche: string[];
  location: string;
  price_range: {
    post: number;
    story: number;
    reel: number;
  };
  verified: boolean;
  rating: number;
  total_collaborations: number;
  response_rate: number;
  average_response_time: string;
  available_for: string[];
  bio: string;
  recent_work: string[];
  collaboration_score: number;
}

interface Campaign {
  id: string;
  title: string;
  brand: string;
  description: string;
  budget: number;
  duration: string;
  requirements: {
    min_followers: number;
    niches: string[];
    locations: string[];
    engagement_rate: number;
  };
  deliverables: string[];
  deadline: string;
  status: 'open' | 'in_review' | 'completed';
  applications: number;
  max_influencers: number;
}

const InfluencerMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'campaigns' | 'my_campaigns'>('browse');
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    loadInfluencers();
    loadCampaigns();
  }, []);

  const loadInfluencers = () => {
    // Sample influencer data
    const sampleInfluencers: Influencer[] = [
      {
        id: '1',
        username: 'fitness_sarah',
        displayName: 'Sarah Johnson',
        profileImage: 'https://via.placeholder.com/100',
        followers: 125000,
        engagement_rate: 4.2,
        niche: ['fitness', 'wellness', 'lifestyle'],
        location: 'Los Angeles, CA',
        price_range: { post: 800, story: 300, reel: 1200 },
        verified: true,
        rating: 4.8,
        total_collaborations: 47,
        response_rate: 95,
        average_response_time: '2 hours',
        available_for: ['brand partnerships', 'product reviews', 'sponsored content'],
        bio: 'Fitness coach helping people transform their lives 💪 Available for authentic brand partnerships',
        recent_work: ['nike_campaign.jpg', 'protein_review.jpg', 'workout_reel.mp4'],
        collaboration_score: 92
      },
      {
        id: '2',
        username: 'foodie_mike',
        displayName: 'Mike Rodriguez',
        profileImage: 'https://via.placeholder.com/100',
        followers: 89000,
        engagement_rate: 5.1,
        niche: ['food', 'cooking', 'restaurants'],
        location: 'New York, NY',
        price_range: { post: 600, story: 250, reel: 900 },
        verified: false,
        rating: 4.9,
        total_collaborations: 32,
        response_rate: 98,
        average_response_time: '1 hour',
        available_for: ['restaurant reviews', 'recipe creation', 'cooking demos'],
        bio: 'Food enthusiast sharing delicious recipes and restaurant discoveries 🍕',
        recent_work: ['pasta_recipe.jpg', 'restaurant_review.jpg', 'cooking_reel.mp4'],
        collaboration_score: 88
      },
      {
        id: '3',
        username: 'travel_emma',
        displayName: 'Emma Thompson',
        profileImage: 'https://via.placeholder.com/100',
        followers: 234000,
        engagement_rate: 3.8,
        niche: ['travel', 'adventure', 'photography'],
        location: 'London, UK',
        price_range: { post: 1500, story: 500, reel: 2000 },
        verified: true,
        rating: 4.7,
        total_collaborations: 68,
        response_rate: 92,
        average_response_time: '3 hours',
        available_for: ['destination promotion', 'hotel reviews', 'travel gear'],
        bio: 'Adventure seeker & travel photographer documenting wanderlust ✈️📸',
        recent_work: ['bali_trip.jpg', 'hotel_review.jpg', 'adventure_reel.mp4'],
        collaboration_score: 95
      }
    ];
    setInfluencers(sampleInfluencers);
  };

  const loadCampaigns = () => {
    // Sample campaign data
    const sampleCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Summer Fitness Challenge',
        brand: 'ActiveWear Pro',
        description: 'Looking for fitness influencers to showcase our new summer collection through workout content and styling posts.',
        budget: 2500,
        duration: '4 weeks',
        requirements: {
          min_followers: 50000,
          niches: ['fitness', 'wellness', 'lifestyle'],
          locations: ['US', 'Canada'],
          engagement_rate: 3.0
        },
        deliverables: ['3 feed posts', '5 stories', '1 reel'],
        deadline: '2025-08-15',
        status: 'open',
        applications: 23,
        max_influencers: 5
      },
      {
        id: '2',
        title: 'Food Festival Promotion',
        brand: 'Taste City Events',
        description: 'Promote our annual food festival through engaging content showcasing local restaurants and culinary experiences.',
        budget: 1800,
        duration: '2 weeks',
        requirements: {
          min_followers: 25000,
          niches: ['food', 'cooking', 'lifestyle'],
          locations: ['New York', 'New Jersey'],
          engagement_rate: 4.0
        },
        deliverables: ['2 feed posts', '10 stories', '2 reels'],
        deadline: '2025-07-30',
        status: 'open',
        applications: 15,
        max_influencers: 3
      },
      {
        id: '3',
        title: 'Travel Gear Review',
        brand: 'Adventure Essentials',
        description: 'Authentic reviews of our new travel gear line for adventure travelers and digital nomads.',
        budget: 3200,
        duration: '6 weeks',
        requirements: {
          min_followers: 100000,
          niches: ['travel', 'adventure', 'lifestyle'],
          locations: ['Global'],
          engagement_rate: 3.5
        },
        deliverables: ['4 feed posts', '15 stories', '3 reels', '1 IGTV'],
        deadline: '2025-09-01',
        status: 'in_review',
        applications: 41,
        max_influencers: 8
      }
    ];
    setCampaigns(sampleCampaigns);
  };

  const niches = ['all', 'fitness', 'food', 'travel', 'fashion', 'beauty', 'tech', 'lifestyle', 'business'];

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         influencer.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = selectedNiche === 'all' || influencer.niche.includes(selectedNiche);
    const matchesPrice = influencer.price_range.post >= priceRange[0] && influencer.price_range.post <= priceRange[1];
    
    return matchesSearch && matchesNiche && matchesPrice;
  });

  const handleContactInfluencer = (influencer: Influencer) => {
    Alert.alert(
      'Contact Influencer',
      `Send a collaboration request to ${influencer.displayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => sendCollaborationRequest(influencer) }
      ]
    );
  };

  const sendCollaborationRequest = (influencer: Influencer) => {
    Alert.alert('Success', `Collaboration request sent to ${influencer.displayName}!`);
  };

  const applyToCampaign = (campaign: Campaign) => {
    Alert.alert(
      'Apply to Campaign',
      `Apply to "${campaign.title}" by ${campaign.brand}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply Now', onPress: () => submitCampaignApplication(campaign) }
      ]
    );
  };

  const submitCampaignApplication = (campaign: Campaign) => {
    Alert.alert('Success', `Application submitted for "${campaign.title}"!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderInfluencerCard = ({ item: influencer }: { item: Influencer }) => (
    <TouchableOpacity 
      style={styles.influencerCard}
      onPress={() => setSelectedInfluencer(influencer)}
    >
      <View style={styles.influencerHeader}>
        <Image source={{ uri: influencer.profileImage }} style={styles.profileImage} />
        <View style={styles.influencerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{influencer.displayName}</Text>
            {influencer.verified && <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" />}
          </View>
          <Text style={styles.username}>@{influencer.username}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.followers}>{(influencer.followers / 1000).toFixed(0)}K followers</Text>
            <Text style={styles.engagement}>{influencer.engagement_rate}% engagement</Text>
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{influencer.collaboration_score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
      </View>

      <View style={styles.nicheContainer}>
        {influencer.niche.slice(0, 3).map(niche => (
          <View key={niche} style={styles.nicheTag}>
            <Text style={styles.nicheText}>{niche}</Text>
          </View>
        ))}
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Post</Text>
          <Text style={styles.priceValue}>{formatPrice(influencer.price_range.post)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Story</Text>
          <Text style={styles.priceValue}>{formatPrice(influencer.price_range.story)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Reel</Text>
          <Text style={styles.priceValue}>{formatPrice(influencer.price_range.reel)}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleContactInfluencer(influencer)}
        >
          <Ionicons name="mail" size={16} color="white" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCampaignCard = ({ item: campaign }: { item: Campaign }) => (
    <TouchableOpacity style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <View>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          <Text style={styles.brandName}>by {campaign.brand}</Text>
        </View>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetValue}>{formatPrice(campaign.budget)}</Text>
          <Text style={styles.budgetLabel}>Budget</Text>
        </View>
      </View>

      <Text style={styles.campaignDescription}>{campaign.description}</Text>

      <View style={styles.requirementsContainer}>
        <View style={styles.requirement}>
          <Ionicons name="people" size={14} color="#666" />
          <Text style={styles.requirementText}>{(campaign.requirements.min_followers / 1000).toFixed(0)}K+ followers</Text>
        </View>
        <View style={styles.requirement}>
          <Ionicons name="heart" size={14} color="#666" />
          <Text style={styles.requirementText}>{campaign.requirements.engagement_rate}%+ engagement</Text>
        </View>
        <View style={styles.requirement}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.requirementText}>{campaign.duration}</Text>
        </View>
      </View>

      <View style={styles.deliverablesContainer}>
        <Text style={styles.deliverablesTitle}>Deliverables:</Text>
        <Text style={styles.deliverables}>{campaign.deliverables.join(', ')}</Text>
      </View>

      <View style={styles.campaignFooter}>
        <View style={styles.applicationStats}>
          <Text style={styles.applicationsText}>{campaign.applications} applications</Text>
          <Text style={styles.deadline}>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => applyToCampaign(campaign)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Influencer Marketplace</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
            Browse Influencers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'campaigns' && styles.activeTab]}
          onPress={() => setActiveTab('campaigns')}
        >
          <Text style={[styles.tabText, activeTab === 'campaigns' && styles.activeTabText]}>
            Campaigns
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my_campaigns' && styles.activeTab]}
          onPress={() => setActiveTab('my_campaigns')}
        >
          <Text style={[styles.tabText, activeTab === 'my_campaigns' && styles.activeTabText]}>
            My Campaigns
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'browse' ? "Search influencers..." : "Search campaigns..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Niche Filter */}
      {activeTab === 'browse' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nicheFilter}>
          {niches.map(niche => (
            <TouchableOpacity
              key={niche}
              style={[
                styles.nicheFilterItem,
                selectedNiche === niche && styles.selectedNicheFilter
              ]}
              onPress={() => setSelectedNiche(niche)}
            >
              <Text style={[
                styles.nicheFilterText,
                selectedNiche === niche && styles.selectedNicheFilterText
              ]}>
                {niche === 'all' ? 'All' : niche.charAt(0).toUpperCase() + niche.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Content */}
      {activeTab === 'browse' && (
        <FlatList
          data={filteredInfluencers}
          renderItem={renderInfluencerCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'campaigns' && (
        <FlatList
          data={campaigns}
          renderItem={renderCampaignCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'my_campaigns' && (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Active Campaigns</Text>
          <Text style={styles.emptyStateText}>
            Create your first campaign to start collaborating with influencers
          </Text>
          <TouchableOpacity 
            style={styles.createCampaignButton}
            onPress={() => setShowCampaignModal(true)}
          >
            <Text style={styles.createCampaignButtonText}>Create Campaign</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range (per post)</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeLabel}>
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSelectedNiche('all');
                  setPriceRange([0, 5000]);
                }}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyFiltersButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E1306C',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E1306C',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  nicheFilter: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  nicheFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedNicheFilter: {
    backgroundColor: '#E1306C',
  },
  nicheFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedNicheFilterText: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
  },
  influencerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  influencerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  influencerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  followers: {
    fontSize: 12,
    color: '#666',
  },
  engagement: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    minWidth: 50,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1306C',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  nicheContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  nicheTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nicheText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1306C',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 4,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1306C',
    borderRadius: 8,
    paddingVertical: 10,
  },
  viewButtonText: {
    color: '#E1306C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  campaignCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '70%',
  },
  brandName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  budgetContainer: {
    alignItems: 'flex-end',
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#666',
  },
  campaignDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  requirementsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
  },
  deliverablesContainer: {
    marginBottom: 16,
  },
  deliverablesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deliverables: {
    fontSize: 12,
    color: '#666',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationStats: {
    flex: 1,
  },
  applicationsText: {
    fontSize: 12,
    color: '#666',
  },
  deadline: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#E1306C',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  createCampaignButton: {
    backgroundColor: '#E1306C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  createCampaignButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filtersModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
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
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceRangeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  priceRangeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#E1306C',
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InfluencerMarketplace;
