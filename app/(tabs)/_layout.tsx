import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, MessageCircle, TrendingUp, FileText, User } from 'lucide-react-native';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border, //Adds space at the bottom of the tab bar
            paddingBottom: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tutor"
          options={{
            title: 'Tutor',
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pdf-tools"
          options={{
            title: 'PDF Tools',
            tabBarIcon: ({ size, color }) => (
              <FileText size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}