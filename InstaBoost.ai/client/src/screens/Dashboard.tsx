import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface StatsCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, change }) => (
  <View style={[styles.statsCard, { borderLeftColor: color }]}>
    <View style={styles.statsHeader}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
    <Text style={styles.statsValue}>{value}</Text>
    {change && (
      <Text style={[styles.statsChange, { color: change.startsWith('+') ? '#4CAF50' : '#F44336' }]}>
        {change}
      </Text>
    )}
  </View>
);

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    followers: '1,234',
    following: '567',
    posts: '89',
    engagement: '5.2%',
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Success', 'Dashboard data refreshed!');
    }, 2000);
  }, []);

  const quickActions = [
    {
      title: 'Generate Caption',
      icon: 'create' as keyof typeof Ionicons.glyphMap,
      color: '#E1306C',
      onPress: () => Alert.alert('Navigate', 'Go to Caption Generator'),
    },
    {
      title: 'View Analytics',
      icon: 'analytics' as keyof typeof Ionicons.glyphMap,
      color: '#2196F3',
      onPress: () => Alert.alert('Navigate', 'Go to Analytics'),
    },
    {
      title: 'Auto Follow',
      icon: 'people' as keyof typeof Ionicons.glyphMap,
      color: '#FF9800',
      onPress: () => Alert.alert('Feature', 'Auto Follow coming soon!'),
    },
    {
      title: 'Hashtag Tool',
      icon: 'hash' as keyof typeof Ionicons.glyphMap,
      color: '#9C27B0',
      onPress: () => Alert.alert('Feature', 'Hashtag Tool coming soon!'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back! 👋</Text>
        <Text style={styles.subtitle}>Let's grow your Instagram today</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatsCard
          title="Followers"
          value={userStats.followers}
          icon="people"
          color="#E1306C"
          change="+12 today"
        />
        <StatsCard
          title="Following"
          value={userStats.following}
          icon="person-add"
          color="#2196F3"
          change="+5 today"
        />
        <StatsCard
          title="Posts"
          value={userStats.posts}
          icon="grid"
          color="#FF9800"
          change="+2 this week"
        />
        <StatsCard
          title="Engagement"
          value={userStats.engagement}
          icon="heart"
          color="#4CAF50"
          change="+0.3% this week"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.activityText}>Caption generated for "Sunset vibes" post</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Ionicons name="trending-up" size={20} color="#2196F3" />
          <Text style={styles.activityText}>+25 new followers this week</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Ionicons name="analytics" size={20} color="#FF9800" />
          <Text style={styles.activityText}>Engagement rate increased by 0.5%</Text>
          <Text style={styles.activityTime}>3 days ago</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statsChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default Dashboard;