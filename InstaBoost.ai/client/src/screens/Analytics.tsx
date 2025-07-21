import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const Analytics: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Track your Instagram growth</Text>
      </View>

      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonTitle}>📊 Analytics Coming Soon!</Text>
        <Text style={styles.comingSoonText}>
          We're working on bringing you detailed analytics including:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Follower growth trends</Text>
          <Text style={styles.featureItem}>• Engagement rate analysis</Text>
          <Text style={styles.featureItem}>• Best posting times</Text>
          <Text style={styles.featureItem}>• Top performing hashtags</Text>
          <Text style={styles.featureItem}>• Post performance metrics</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  comingSoon: {
    margin: 20,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default Analytics;
