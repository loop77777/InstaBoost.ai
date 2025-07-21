import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Dashboard from './src/screens/Dashboard';
import CaptionGenerator from './src/screens/CaptionGenerator';
import Analytics from './src/screens/Analytics';
import Profile from './src/screens/Profile';

// Import new premium screens
import ContentCalendar from './src/screens/ContentCalendar';
import ReelEditor from './src/screens/ReelEditor';
import InfluencerMarketplace from './src/screens/InfluencerMarketplace';
import CreditsStore from './src/screens/CreditsStore';

// Import business and sponsor screens
import BusinessDashboard from './src/screens/BusinessDashboard';
import SponsorDiscovery from './src/screens/SponsorDiscovery';

// Import compliance screen
import ComplianceCenter from './src/screens/ComplianceCenter';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create stack navigator for More tab
function MoreStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#E1306C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="MoreHome" 
        component={Profile} 
        options={{ title: 'More' }}
      />
      <Stack.Screen 
        name="ContentCalendar" 
        component={ContentCalendar} 
        options={{ title: 'Content Calendar' }}
      />
      <Stack.Screen 
        name="ReelEditor" 
        component={ReelEditor} 
        options={{ title: 'Reel Editor' }}
      />
      <Stack.Screen 
        name="InfluencerMarketplace" 
        component={InfluencerMarketplace} 
        options={{ title: 'Influencer Marketplace' }}
      />
      <Stack.Screen 
        name="CreditsStore" 
        component={CreditsStore} 
        options={{ title: 'Credits Store' }}
      />
      <Stack.Screen 
        name="BusinessDashboard" 
        component={BusinessDashboard} 
        options={{ title: 'Business Dashboard' }}
      />
      <Stack.Screen 
        name="SponsorDiscovery" 
        component={SponsorDiscovery} 
        options={{ title: 'Find Sponsors' }}
      />
      <Stack.Screen 
        name="ComplianceCenter" 
        component={ComplianceCenter} 
        options={{ title: 'ToS Compliance' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Dashboard') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Caption') {
                iconName = focused ? 'create' : 'create-outline';
              } else if (route.name === 'Analytics') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              } else if (route.name === 'More') {
                iconName = focused ? 'apps' : 'apps-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#E1306C',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#E1306C',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={Dashboard} 
            options={{ title: 'InstaBoost' }}
          />
          <Tab.Screen 
            name="Caption" 
            component={CaptionGenerator} 
            options={{ title: 'Caption AI' }}
          />
          <Tab.Screen 
            name="Analytics" 
            component={Analytics} 
            options={{ title: 'Analytics' }}
          />
          <Tab.Screen 
            name="More" 
            component={MoreStackNavigator} 
            options={{ 
              title: 'More',
              headerShown: false // Hide header for stack navigator
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}