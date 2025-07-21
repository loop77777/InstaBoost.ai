import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Profile: React.FC = () => {
  const handleAction = (action: string) => {
    Alert.alert('Action', `${action} feature coming soon!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <Text style={styles.username}>@your_username</Text>
          <Text style={styles.displayName}>Your Display Name</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Connect Instagram')}>
          <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          <Text style={styles.menuText}>Connect Instagram Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Subscription')}>
          <Ionicons name="diamond" size={24} color="#FFD700" />
          <Text style={styles.menuText}>Subscription & Billing</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Notifications')}>
          <Ionicons name="notifications" size={24} color="#2196F3" />
          <Text style={styles.menuText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro Features</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Collab Finder')}>
          <Ionicons name="people-circle" size={24} color="#FF6B35" />
          <Text style={styles.menuText}>Collab Finder</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PRO</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Advanced Analytics')}>
          <Ionicons name="analytics" size={24} color="#00BCD4" />
          <Text style={styles.menuText}>Advanced Analytics</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>PRO</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Automation Settings</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Auto Follow')}>
          <Ionicons name="people" size={24} color="#FF9800" />
          <Text style={styles.menuText}>Auto Follow Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Hashtag Preferences')}>
          <Ionicons name="hash" size={24} color="#9C27B0" />
          <Text style={styles.menuText}>Hashtag Preferences</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Info</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Help Center')}>
          <Ionicons name="help-circle" size={24} color="#4CAF50" />
          <Text style={styles.menuText}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('Privacy Policy')}>
          <Ionicons name="shield-checkmark" size={24} color="#795548" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleAction('About')}>
          <Ionicons name="information-circle" size={24} color="#607D8B" />
          <Text style={styles.menuText}>About InstaBoost.ai</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={() => handleAction('Logout')}>
          <Ionicons name="log-out" size={24} color="#F44336" />
          <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>InstaBoost.ai v1.0.0</Text>
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1306C',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutItem: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  logoutText: {
    color: '#F44336',
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  proText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default Profile;
