import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ComplianceCheck {
  id: string;
  feature: string;
  status: 'compliant' | 'warning' | 'violation';
  description: string;
  recommendation?: string;
}

interface OrganicTip {
  category: string;
  title: string;
  description: string;
  icon: string;
}

export default function ComplianceCenter() {
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [organicTips, setOrganicTips] = useState<OrganicTip[]>([]);
  const [overallStatus, setOverallStatus] = useState<'compliant' | 'warning' | 'violation'>('compliant');

  useEffect(() => {
    loadComplianceData();
    loadOrganicTips();
  }, []);

  const loadComplianceData = () => {
    const checks: ComplianceCheck[] = [
      {
        id: '1',
        feature: 'AI Caption Generation',
        status: 'compliant',
        description: 'User-initiated content creation using OpenAI API',
      },
      {
        id: '2',
        feature: 'Analytics Dashboard',
        status: 'compliant',
        description: 'Uses official Instagram Graph API for insights',
      },
      {
        id: '3',
        feature: 'Content Calendar',
        status: 'compliant',
        description: 'Manual post scheduling interface',
      },
      {
        id: '4',
        feature: 'Business Tools',
        status: 'compliant',
        description: 'Sponsor management and collaboration features',
      },
      {
        id: '5',
        feature: 'Automation Features',
        status: 'compliant',
        description: 'All automation features removed for ToS compliance',
      },
    ];
    
    setComplianceChecks(checks);
    
    // Calculate overall status
    const hasViolations = checks.some(check => check.status === 'violation');
    const hasWarnings = checks.some(check => check.status === 'warning');
    
    if (hasViolations) {
      setOverallStatus('violation');
    } else if (hasWarnings) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('compliant');
    }
  };

  const loadOrganicTips = () => {
    const tips: OrganicTip[] = [
      {
        category: 'Content Strategy',
        title: 'Post Consistently',
        description: 'Share high-quality content regularly at optimal times',
        icon: 'calendar-outline',
      },
      {
        category: 'Engagement',
        title: 'Authentic Interactions',
        description: 'Respond to comments and engage genuinely with your audience',
        icon: 'chatbubble-outline',
      },
      {
        category: 'Hashtags',
        title: 'Relevant Tags',
        description: 'Use 5-10 relevant hashtags, not trending unrelated ones',
        icon: 'pricetag-outline',
      },
      {
        category: 'Content Quality',
        title: 'High-Quality Visuals',
        description: 'Focus on creating visually appealing and valuable content',
        icon: 'camera-outline',
      },
      {
        category: 'Community',
        title: 'Build Relationships',
        description: 'Collaborate with similar accounts and build genuine connections',
        icon: 'people-outline',
      },
      {
        category: 'Analytics',
        title: 'Track Performance',
        description: 'Monitor your content performance and adjust strategy accordingly',
        icon: 'analytics-outline',
      },
    ];
    
    setOrganicTips(tips);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#00D084';
      case 'warning':
        return '#FFA500';
      case 'violation':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'violation':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const showComplianceDetails = () => {
    Alert.alert(
      'Instagram ToS Compliance',
      'This app is designed to be 100% compliant with Instagram Terms of Service. All features use official APIs and require manual user approval.',
      [{ text: 'OK' }]
    );
  };

  const showOrganicGrowthGuide = () => {
    Alert.alert(
      'Organic Growth Strategy',
      'Focus on creating quality content, engaging authentically with your audience, and building genuine relationships. Avoid any automation or fake engagement.',
      [{ text: 'Got it!' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Ionicons name="shield-checkmark" size={24} color="#00D084" />
            <Text style={styles.headerText}>Instagram ToS Compliance</Text>
          </View>
          <TouchableOpacity onPress={showComplianceDetails}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Overall Status */}
        <View style={[styles.statusCard, { borderLeftColor: getStatusColor(overallStatus) }]}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon(overallStatus)} 
              size={28} 
              color={getStatusColor(overallStatus)} 
            />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>
                {overallStatus === 'compliant' ? '✅ Fully Compliant' : 
                 overallStatus === 'warning' ? '⚠️ Needs Attention' : 
                 '❌ Violations Found'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {overallStatus === 'compliant' 
                  ? 'All features comply with Instagram ToS'
                  : 'Some features need review'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Compliance Checks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Compliance Status</Text>
          {complianceChecks.map((check) => (
            <View key={check.id} style={styles.checkItem}>
              <View style={styles.checkHeader}>
                <Ionicons 
                  name={getStatusIcon(check.status)} 
                  size={20} 
                  color={getStatusColor(check.status)} 
                />
                <Text style={styles.checkTitle}>{check.feature}</Text>
              </View>
              <Text style={styles.checkDescription}>{check.description}</Text>
              {check.recommendation && (
                <Text style={styles.checkRecommendation}>💡 {check.recommendation}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Organic Growth Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Organic Growth Tips</Text>
            <TouchableOpacity onPress={showOrganicGrowthGuide}>
              <Ionicons name="help-circle-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {organicTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipHeader}>
                <Ionicons name={tip.icon as any} size={20} color="#007AFF" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </View>

        {/* Educational Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Practices</Text>
          
          <View style={styles.educationCard}>
            <Text style={styles.educationTitle}>✅ What We Do (Compliant)</Text>
            <Text style={styles.educationText}>
              • AI-powered content creation{'\n'}
              • Official Instagram API usage{'\n'}
              • User-initiated actions only{'\n'}
              • Educational growth recommendations{'\n'}
              • Business management tools
            </Text>
          </View>

          <View style={styles.educationCard}>
            <Text style={styles.educationTitle}>❌ What We Don't Do (Prohibited)</Text>
            <Text style={styles.educationText}>
              • NO automated following/unfollowing{'\n'}
              • NO automated liking/commenting{'\n'}
              • NO bulk messaging or spam{'\n'}
              • NO fake engagement or bots{'\n'}
              • NO data scraping or violations
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🛡️ This app is designed to be 100% compliant with Instagram's Terms of Service
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  statusCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  checkItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  checkDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
  },
  checkRecommendation: {
    fontSize: 14,
    color: '#FFA500',
    marginLeft: 28,
    marginTop: 4,
    fontStyle: 'italic',
  },
  tipItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tipContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
  },
  educationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  educationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
