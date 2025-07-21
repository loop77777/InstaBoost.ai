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
  Switch,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  category: string;
  budget: number;
  activeInfluencers: number;
  campaignStatus: 'active' | 'paused' | 'completed';
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  dateAdded: string;
  lastActivity: string;
}

interface InfluencerPartnership {
  id: string;
  influencerName: string;
  followers: number;
  engagementRate: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  campaignResults: {
    posts: number;
    reach: number;
    engagement: number;
    clicks: number;
  };
  contractEnd: string;
}

const BusinessDashboard: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [partnerships, setPartnerships] = useState<InfluencerPartnership[]>([]);
  const [isAddingSponsor, setIsAddingSponsor] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'sponsors' | 'partnerships' | 'analytics'>('sponsors');
  const [searchQuery, setSearchQuery] = useState('');

  // New sponsor form state
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    category: '',
    budget: '',
    logo: '',
    description: ''
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      // Simulate API call
      const mockSponsors: Sponsor[] = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          logo: 'https://via.placeholder.com/60',
          category: 'Technology',
          budget: 50000,
          activeInfluencers: 12,
          campaignStatus: 'active',
          performance: { reach: 2500000, engagement: 185000, conversions: 1250, roi: 3.2 },
          dateAdded: '2024-01-15',
          lastActivity: '2024-03-20'
        },
        {
          id: '2',
          name: 'Fashion Forward',
          logo: 'https://via.placeholder.com/60',
          category: 'Fashion',
          budget: 30000,
          activeInfluencers: 8,
          campaignStatus: 'active',
          performance: { reach: 1800000, engagement: 145000, conversions: 890, roi: 2.8 },
          dateAdded: '2024-02-01',
          lastActivity: '2024-03-19'
        }
      ];

      const mockPartnerships: InfluencerPartnership[] = [
        {
          id: '1',
          influencerName: '@fashionista_jane',
          followers: 125000,
          engagementRate: 4.2,
          category: 'Fashion',
          status: 'active',
          campaignResults: { posts: 12, reach: 890000, engagement: 37500, clicks: 2100 },
          contractEnd: '2024-06-30'
        },
        {
          id: '2',
          influencerName: '@tech_reviewer_pro',
          followers: 85000,
          engagementRate: 6.1,
          category: 'Technology',
          status: 'inactive',
          campaignResults: { posts: 8, reach: 520000, engagement: 31700, clicks: 1580 },
          contractEnd: '2024-03-15'
        }
      ];

      setSponsors(mockSponsors);
      setPartnerships(mockPartnerships);
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const addSponsor = async () => {
    if (!newSponsor.name || !newSponsor.category || !newSponsor.budget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const sponsor: Sponsor = {
        id: Date.now().toString(),
        name: newSponsor.name,
        logo: newSponsor.logo || 'https://via.placeholder.com/60',
        category: newSponsor.category,
        budget: parseFloat(newSponsor.budget),
        activeInfluencers: 0,
        campaignStatus: 'active',
        performance: { reach: 0, engagement: 0, conversions: 0, roi: 0 },
        dateAdded: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0]
      };

      setSponsors([...sponsors, sponsor]);
      setNewSponsor({ name: '', category: '', budget: '', logo: '', description: '' });
      setIsAddingSponsor(false);
      Alert.alert('Success', 'Sponsor added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add sponsor');
    }
  };

  const removeSponsor = (sponsorId: string) => {
    Alert.alert(
      'Remove Sponsor',
      'Are you sure you want to remove this sponsor? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSponsors(sponsors.filter(s => s.id !== sponsorId));
            Alert.alert('Success', 'Sponsor removed successfully');
          }
        }
      ]
    );
  };

  const removeInactivePartnership = (partnershipId: string) => {
    Alert.alert(
      'Remove Partnership',
      'Remove this inactive partnership to improve community growth?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPartnerships(partnerships.filter(p => p.id !== partnershipId));
            Alert.alert('Success', 'Inactive partnership removed');
          }
        }
      ]
    );
  };

  const toggleCampaignStatus = (sponsorId: string) => {
    setSponsors(sponsors.map(sponsor => {
      if (sponsor.id === sponsorId) {
        const newStatus = sponsor.campaignStatus === 'active' ? 'paused' : 'active';
        return { ...sponsor, campaignStatus: newStatus };
      }
      return sponsor;
    }));
  };

  const renderSponsorCard = ({ item }: { item: Sponsor }) => (
    <View style={styles.sponsorCard}>
      <View style={styles.sponsorHeader}>
        <Image source={{ uri: item.logo }} style={styles.sponsorLogo} />
        <View style={styles.sponsorInfo}>
          <Text style={styles.sponsorName}>{item.name}</Text>
          <Text style={styles.sponsorCategory}>{item.category}</Text>
          <Text style={styles.sponsorBudget}>${item.budget.toLocaleString()} budget</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeSponsor(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.sponsorStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.activeInfluencers}</Text>
          <Text style={styles.statLabel}>Active Influencers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(item.performance.reach / 1000000).toFixed(1)}M</Text>
          <Text style={styles.statLabel}>Total Reach</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.performance.roi.toFixed(1)}x</Text>
          <Text style={styles.statLabel}>ROI</Text>
        </View>
      </View>

      <View style={styles.sponsorActions}>
        <View style={styles.statusToggle}>
          <Text style={styles.statusLabel}>Campaign Active</Text>
          <Switch
            value={item.campaignStatus === 'active'}
            onValueChange={() => toggleCampaignStatus(item.id)}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
          />
        </View>
        <Text style={[styles.statusBadge, 
          { backgroundColor: item.campaignStatus === 'active' ? '#4CAF50' : '#FF9800' }]}>
          {item.campaignStatus.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  const renderPartnershipCard = ({ item }: { item: InfluencerPartnership }) => (
    <View style={[styles.partnershipCard, 
      { borderLeftColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
      <View style={styles.partnershipHeader}>
        <View style={styles.influencerInfo}>
          <Text style={styles.influencerName}>{item.influencerName}</Text>
          <Text style={styles.influencerStats}>
            {(item.followers / 1000).toFixed(0)}K followers • {item.engagementRate}% engagement
          </Text>
          <Text style={styles.influencerCategory}>{item.category}</Text>
        </View>
        {item.status === 'inactive' && (
          <TouchableOpacity
            style={styles.removeInactiveButton}
            onPress={() => removeInactivePartnership(item.id)}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#FF4444" />
            <Text style={styles.removeInactiveText}>Remove Inactive</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.campaignResults}>
        <Text style={styles.resultsTitle}>Campaign Results:</Text>
        <View style={styles.resultStats}>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{item.campaignResults.posts}</Text>
            <Text style={styles.resultLabel}>Posts</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{(item.campaignResults.reach / 1000).toFixed(0)}K</Text>
            <Text style={styles.resultLabel}>Reach</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{(item.campaignResults.engagement / 1000).toFixed(1)}K</Text>
            <Text style={styles.resultLabel}>Engagement</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{item.campaignResults.clicks}</Text>
            <Text style={styles.resultLabel}>Clicks</Text>
          </View>
        </View>
      </View>

      <View style={styles.partnershipFooter}>
        <Text style={styles.contractEnd}>Contract ends: {item.contractEnd}</Text>
        <View style={[styles.statusIndicator, 
          { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Dashboard</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingSponsor(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sponsors' && styles.activeTab]}
          onPress={() => setSelectedTab('sponsors')}
        >
          <Text style={[styles.tabText, selectedTab === 'sponsors' && styles.activeTabText]}>
            Sponsors ({sponsors.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'partnerships' && styles.activeTab]}
          onPress={() => setSelectedTab('partnerships')}
        >
          <Text style={[styles.tabText, selectedTab === 'partnerships' && styles.activeTabText]}>
            Partnerships ({partnerships.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === 'sponsors' && (
          <View>
            <Text style={styles.sectionTitle}>Your Sponsors</Text>
            <FlatList
              data={sponsors}
              renderItem={renderSponsorCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === 'partnerships' && (
          <View>
            <Text style={styles.sectionTitle}>Influencer Partnerships</Text>
            <Text style={styles.sectionSubtitle}>
              Remove inactive partnerships to improve community growth
            </Text>
            <FlatList
              data={partnerships}
              renderItem={renderPartnershipCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === 'analytics' && (
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Business Analytics</Text>
            
            <View style={styles.overviewCards}>
              <View style={styles.overviewCard}>
                <Text style={styles.overviewValue}>${sponsors.reduce((sum, s) => sum + s.budget, 0).toLocaleString()}</Text>
                <Text style={styles.overviewLabel}>Total Budget</Text>
              </View>
              <View style={styles.overviewCard}>
                <Text style={styles.overviewValue}>{sponsors.reduce((sum, s) => sum + s.activeInfluencers, 0)}</Text>
                <Text style={styles.overviewLabel}>Active Partnerships</Text>
              </View>
              <View style={styles.overviewCard}>
                <Text style={styles.overviewValue}>
                  {(sponsors.reduce((sum, s) => sum + s.performance.reach, 0) / 1000000).toFixed(1)}M
                </Text>
                <Text style={styles.overviewLabel}>Total Reach</Text>
              </View>
            </View>

            <View style={styles.growthTips}>
              <Text style={styles.tipsTitle}>💡 Community Growth Tips</Text>
              <Text style={styles.tipText}>• Remove inactive partnerships regularly</Text>
              <Text style={styles.tipText}>• Focus on high-engagement influencers</Text>
              <Text style={styles.tipText}>• Monitor ROI and adjust budgets accordingly</Text>
              <Text style={styles.tipText}>• Collaborate with micro-influencers for better engagement</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Sponsor Modal */}
      <Modal visible={isAddingSponsor} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Sponsor</Text>
            <TouchableOpacity onPress={() => setIsAddingSponsor(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sponsor Name *</Text>
              <TextInput
                style={styles.input}
                value={newSponsor.name}
                onChangeText={(text) => setNewSponsor({ ...newSponsor, name: text })}
                placeholder="Enter sponsor name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TextInput
                style={styles.input}
                value={newSponsor.category}
                onChangeText={(text) => setNewSponsor({ ...newSponsor, category: text })}
                placeholder="e.g., Fashion, Technology, Food"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Budget ($) *</Text>
              <TextInput
                style={styles.input}
                value={newSponsor.budget}
                onChangeText={(text) => setNewSponsor({ ...newSponsor, budget: text })}
                placeholder="Enter budget amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Logo URL</Text>
              <TextInput
                style={styles.input}
                value={newSponsor.logo}
                onChangeText={(text) => setNewSponsor({ ...newSponsor, logo: text })}
                placeholder="https://example.com/logo.png"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newSponsor.description}
                onChangeText={(text) => setNewSponsor({ ...newSponsor, description: text })}
                placeholder="Brief description of the sponsor"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={addSponsor}>
              <Text style={styles.submitButtonText}>Add Sponsor</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
  sponsorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sponsorCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sponsorBudget: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  sponsorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sponsorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  partnershipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  influencerInfo: {
    flex: 1,
  },
  influencerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  influencerStats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  influencerCategory: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  removeInactiveButton: {
    alignItems: 'center',
    padding: 8,
  },
  removeInactiveText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 2,
  },
  campaignResults: {
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  partnershipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractEnd: {
    fontSize: 14,
    color: '#666',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analyticsContainer: {
    // Add analytics-specific styles
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  growthTips: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessDashboard;
