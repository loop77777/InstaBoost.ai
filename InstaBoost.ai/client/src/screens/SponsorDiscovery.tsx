import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList,
  Modal,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  campaignBudget: number;
  requirements: {
    minFollowers: number;
    categories: string[];
    engagementRate: number;
  };
  benefits: {
    paymentPerPost: number;
    productGifts: boolean;
    longTermPartnership: boolean;
    exclusiveAccess?: boolean;
  };
  isVerified: boolean;
  rating: number;
  isEligible?: boolean;
}

interface UserProfile {
  followers: number;
  engagementRate: number;
  categories: string[];
  isBusinessAccount: boolean;
  subscriptionTier: 'free' | 'pro' | 'premium';
}

const SponsorDiscovery: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEligibleOnly, setShowEligibleOnly] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  // Filter categories
  const categories = ['all', 'Technology', 'Fashion', 'Lifestyle', 'Food', 'Travel', 'Beauty', 'Fitness'];

  useEffect(() => {
    loadSponsorsAndProfile();
  }, []);

  useEffect(() => {
    filterSponsors();
  }, [sponsors, searchQuery, selectedCategory, showEligibleOnly]);

  const loadSponsorsAndProfile = async () => {
    try {
      // Mock user profile
      const mockProfile: UserProfile = {
        followers: 15000,
        engagementRate: 4.2,
        categories: ['lifestyle', 'technology'],
        isBusinessAccount: true,
        subscriptionTier: 'pro'
      };

      // Mock sponsors data
      const mockSponsors: Sponsor[] = [
        {
          id: '1',
          name: 'EcoFriendly Brand',
          logo: 'https://via.placeholder.com/60',
          category: 'Lifestyle',
          description: 'Sustainable products for everyday life. We partner with influencers who share our values.',
          campaignBudget: 25000,
          requirements: {
            minFollowers: 10000,
            categories: ['lifestyle', 'sustainability', 'health'],
            engagementRate: 2.5
          },
          benefits: {
            paymentPerPost: 500,
            productGifts: true,
            longTermPartnership: true
          },
          isVerified: true,
          rating: 4.8
        },
        {
          id: '2',
          name: 'Tech Innovations Hub',
          logo: 'https://via.placeholder.com/60',
          category: 'Technology',
          description: 'Latest gadgets and tech reviews. Looking for tech enthusiasts with engaged audiences.',
          campaignBudget: 40000,
          requirements: {
            minFollowers: 25000,
            categories: ['technology', 'reviews', 'gadgets'],
            engagementRate: 3.0
          },
          benefits: {
            paymentPerPost: 800,
            productGifts: true,
            longTermPartnership: true,
            exclusiveAccess: true
          },
          isVerified: true,
          rating: 4.9
        },
        {
          id: '3',
          name: 'Fashion Forward Studio',
          logo: 'https://via.placeholder.com/60',
          category: 'Fashion',
          description: 'Trendy fashion for the modern generation. Seeking style influencers.',
          campaignBudget: 35000,
          requirements: {
            minFollowers: 20000,
            categories: ['fashion', 'style', 'beauty'],
            engagementRate: 3.5
          },
          benefits: {
            paymentPerPost: 600,
            productGifts: true,
            longTermPartnership: false
          },
          isVerified: true,
          rating: 4.6
        },
        {
          id: '4',
          name: 'Fitness Revolution',
          logo: 'https://via.placeholder.com/60',
          category: 'Fitness',
          description: 'Transform your fitness journey with our premium equipment and supplements.',
          campaignBudget: 20000,
          requirements: {
            minFollowers: 5000,
            categories: ['fitness', 'health', 'lifestyle'],
            engagementRate: 4.0
          },
          benefits: {
            paymentPerPost: 300,
            productGifts: true,
            longTermPartnership: true
          },
          isVerified: false,
          rating: 4.3
        }
      ];

      // Check eligibility for each sponsor
      const sponsorsWithEligibility = mockSponsors.map(sponsor => ({
        ...sponsor,
        isEligible: checkEligibility(sponsor, mockProfile)
      }));

      setUserProfile(mockProfile);
      setSponsors(sponsorsWithEligibility);
    } catch (error) {
      console.error('Error loading sponsors and profile:', error);
      Alert.alert('Error', 'Failed to load sponsor data');
    }
  };

  const checkEligibility = (sponsor: Sponsor, profile: UserProfile): boolean => {
    // Check followers requirement
    if (profile.followers < sponsor.requirements.minFollowers) return false;
    
    // Check engagement rate requirement
    if (profile.engagementRate < sponsor.requirements.engagementRate) return false;
    
    // Check category overlap
    const hasMatchingCategory = sponsor.requirements.categories.some(category =>
      profile.categories.includes(category.toLowerCase())
    );
    
    return hasMatchingCategory;
  };

  const filterSponsors = () => {
    let filtered = [...sponsors];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(sponsor =>
        sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sponsor =>
        sponsor.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by eligibility
    if (showEligibleOnly) {
      filtered = filtered.filter(sponsor => sponsor.isEligible);
    }

    setFilteredSponsors(filtered);
  };

  const applyToSponsor = (sponsor: Sponsor) => {
    if (!sponsor.isEligible) {
      Alert.alert(
        'Not Eligible',
        'You don\'t meet the requirements for this sponsor. Would you like to see what you need to improve?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Show Requirements', onPress: () => showRequirements(sponsor) }
        ]
      );
      return;
    }

    setSelectedSponsor(sponsor);
    setIsApplicationModalVisible(true);
  };

  const showRequirements = (sponsor: Sponsor) => {
    const requirements = [];
    
    if (userProfile && userProfile.followers < sponsor.requirements.minFollowers) {
      requirements.push(`Need ${sponsor.requirements.minFollowers - userProfile.followers} more followers`);
    }
    
    if (userProfile && userProfile.engagementRate < sponsor.requirements.engagementRate) {
      requirements.push(`Need ${(sponsor.requirements.engagementRate - userProfile.engagementRate).toFixed(1)}% higher engagement rate`);
    }

    const hasMatchingCategory = sponsor.requirements.categories.some(category =>
      userProfile?.categories.includes(category.toLowerCase())
    );
    
    if (!hasMatchingCategory) {
      requirements.push(`Need content in: ${sponsor.requirements.categories.join(', ')}`);
    }

    Alert.alert(
      'Requirements to Meet',
      requirements.join('\n'),
      [{ text: 'OK' }]
    );
  };

  const submitApplication = async () => {
    if (!applicationMessage.trim()) {
      Alert.alert('Error', 'Please write a message to the sponsor');
      return;
    }

    try {
      // Simulate API call
      Alert.alert(
        'Application Submitted!',
        `Your application to ${selectedSponsor?.name} has been submitted. You'll hear back within 2-5 business days.`,
        [{ text: 'OK', onPress: () => {
          setIsApplicationModalVisible(false);
          setApplicationMessage('');
          setSelectedSponsor(null);
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
    }
  };

  const renderSponsorCard = ({ item }: { item: Sponsor }) => (
    <View style={[styles.sponsorCard, !item.isEligible && styles.ineligibleCard]}>
      <View style={styles.sponsorHeader}>
        <Image source={{ uri: item.logo }} style={styles.sponsorLogo} />
        <View style={styles.sponsorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.sponsorName}>{item.name}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            )}
          </View>
          <Text style={styles.sponsorCategory}>{item.category}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.eligibilityBadge}>
          {item.isEligible ? (
            <View style={styles.eligibleBadge}>
              <Ionicons name="checkmark" size={12} color="white" />
              <Text style={styles.eligibleText}>Eligible</Text>
            </View>
          ) : (
            <View style={styles.ineligibleBadge}>
              <Ionicons name="close" size={12} color="white" />
              <Text style={styles.ineligibleText}>Not Eligible</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.requirementsSection}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        <View style={styles.requirementsList}>
          <Text style={styles.requirement}>
            📊 {item.requirements.minFollowers.toLocaleString()}+ followers
          </Text>
          <Text style={styles.requirement}>
            💝 {item.requirements.engagementRate}%+ engagement
          </Text>
          <Text style={styles.requirement}>
            🏷️ Categories: {item.requirements.categories.join(', ')}
          </Text>
        </View>
      </View>

      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>Benefits:</Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefit}>
            💰 ${item.benefits.paymentPerPost}/post
          </Text>
          {item.benefits.productGifts && (
            <Text style={styles.benefit}>🎁 Product gifts</Text>
          )}
          {item.benefits.longTermPartnership && (
            <Text style={styles.benefit}>🤝 Long-term partnership</Text>
          )}
          {item.benefits.exclusiveAccess && (
            <Text style={styles.benefit}>⭐ Exclusive access</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.applyButton, !item.isEligible && styles.disabledButton]}
        onPress={() => applyToSponsor(item)}
      >
        <Text style={[styles.applyButtonText, !item.isEligible && styles.disabledButtonText]}>
          {item.isEligible ? 'Apply Now' : 'View Requirements'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilter = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryChipText]}>
        {category === 'all' ? 'All' : category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sponsor Discovery</Text>
        <View style={styles.headerStats}>
          <Text style={styles.headerStat}>
            {filteredSponsors.filter(s => s.isEligible).length} Eligible Sponsors
          </Text>
        </View>
      </View>

      {/* User Profile Summary */}
      {userProfile && (
        <View style={styles.profileSummary}>
          <Text style={styles.profileTitle}>Your Profile</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{userProfile.followers.toLocaleString()}</Text>
              <Text style={styles.profileStatLabel}>Followers</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{userProfile.engagementRate}%</Text>
              <Text style={styles.profileStatLabel}>Engagement</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{userProfile.categories.length}</Text>
              <Text style={styles.profileStatLabel}>Categories</Text>
            </View>
          </View>
        </View>
      )}

      {/* Search and Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sponsors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(renderCategoryFilter)}
        </ScrollView>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Show eligible only</Text>
          <Switch
            value={showEligibleOnly}
            onValueChange={setShowEligibleOnly}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
          />
        </View>
      </View>

      {/* Sponsors List */}
      <FlatList
        data={filteredSponsors}
        renderItem={renderSponsorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sponsorsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No Sponsors Found</Text>
            <Text style={styles.emptyStateDescription}>
              {showEligibleOnly 
                ? 'Try disabling "eligible only" filter or improve your profile to meet more requirements'
                : 'Try adjusting your search criteria'
              }
            </Text>
          </View>
        }
      />

      {/* Application Modal */}
      <Modal visible={isApplicationModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply to {selectedSponsor?.name}</Text>
            <TouchableOpacity onPress={() => setIsApplicationModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedSponsor && (
              <View style={styles.sponsorSummary}>
                <Image source={{ uri: selectedSponsor.logo }} style={styles.modalSponsorLogo} />
                <Text style={styles.modalSponsorName}>{selectedSponsor.name}</Text>
                <Text style={styles.modalSponsorCategory}>{selectedSponsor.category}</Text>
                <Text style={styles.modalPayment}>
                  ${selectedSponsor.benefits.paymentPerPost}/post
                </Text>
              </View>
            )}

            <View style={styles.applicationForm}>
              <Text style={styles.formLabel}>Tell the sponsor why you'd be a great fit:</Text>
              <TextInput
                style={styles.messageInput}
                multiline
                numberOfLines={6}
                placeholder="Write your pitch here... Include your niche, audience demographics, and why you're passionate about their brand."
                value={applicationMessage}
                onChangeText={setApplicationMessage}
                textAlignVertical="top"
              />

              <View style={styles.tipSection}>
                <Text style={styles.tipTitle}>💡 Application Tips:</Text>
                <Text style={styles.tipText}>• Mention your audience demographics</Text>
                <Text style={styles.tipText}>• Share relevant past collaborations</Text>
                <Text style={styles.tipText}>• Explain your content creation process</Text>
                <Text style={styles.tipText}>• Show genuine interest in their brand</Text>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={submitApplication}>
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
  },
  headerStat: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  profileSummary: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  filtersSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategoryChip: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sponsorsList: {
    paddingHorizontal: 16,
  },
  sponsorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ineligibleCard: {
    opacity: 0.7,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  sponsorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sponsorLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  sponsorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  sponsorCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '600',
  },
  eligibilityBadge: {
    marginLeft: 8,
  },
  eligibleBadge: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eligibleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ineligibleBadge: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ineligibleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  requirementsList: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  requirement: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  benefitsSection: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  benefitsList: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
  },
  benefit: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
    lineHeight: 18,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sponsorSummary: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  modalSponsorLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalSponsorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSponsorCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalPayment: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  applicationForm: {
    // Form styles
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    height: 120,
    marginBottom: 20,
  },
  tipSection: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SponsorDiscovery;
