import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Settings,
  Moon,
  Sun,
  Zap,
  CreditCard,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {

  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const { colors, setTheme, isDark } = useTheme();

  const stats = [
    { label: 'AI Credits', value: '245', icon: Zap, color: colors.warning },
    { label: 'Sessions', value: '127', icon: User, color: colors.primary },
    { label: 'Streak', value: '12 days', icon: Crown, color: colors.success },
  ];

  const menuItems = [
    {
      icon: CreditCard,
      title: 'Subscription',
      subtitle: 'Pro Plan - $9.99/month',
      action: 'subscription',
      showChevron: true,
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage alerts',
      action: 'notifications-settings',
      showChevron: true,
    },
    {
      icon: Shield,
      title: 'Privacy Settings',
      subtitle: 'Data & security',
      action: 'privacy',
      showChevron: true,
    },
    {
      icon: Settings,
      title: 'Account Settings',
      subtitle: 'Profile & preferences',
      action: 'account-settings',
      showChevron: true,
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'FAQ & contact',
      action: 'help-and-support',
      showChevron: true,
    },
  ];

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <SafeAreaView
          edges={['top']}
          style={[styles.safeArea, { backgroundColor: colors.background }]}
        >
          <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Profile */}
        <View style={[styles.profileSection, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Alex Johnson</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              alex.johnson@email.com
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Crown size={12} color="#FFFFFF" />
              <Text style={styles.badgeText}>Pro Member</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}
            >
              <stat.icon size={20} color={stat.color} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Theme Toggle */}
        <View style={[styles.themeSection, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <View style={styles.themeHeader}>
            <View style={styles.themeInfo}>
              {isDark ? (
                <Moon size={20} color={colors.text} />
              ) : (
                <Sun size={20} color={colors.text} />
              )}
              <Text style={[styles.themeTitle, { color: colors.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : colors.surface}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border , borderRadius: 16, padding: 16, marginVertical: 4 }]}
              activeOpacity={0.7}
              onPress={() => router.push(item.action)}
            >
              <item.icon size={20} color={colors.textSecondary} />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              {item.showChevron && (
                <ChevronRight size={16} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Billing History */}
        <View style={[styles.billingSection, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Billing History</Text>
          
          <View style={[styles.billingItem,{ borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
            <View style={styles.billingInfo}>
              <Text style={[styles.billingDate, { color: colors.text }]}>Jan 2025</Text>
              <Text style={[styles.billingDesc, { color: colors.textSecondary }]}>
                Pro Plan Subscription
              </Text>
            </View>
            <Text style={[styles.billingAmount, { color: colors.success }]}>$9.99</Text>
          </View>
          
          <View style={[styles.billingItem, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16 }]}>
            <View style={styles.billingInfo}>
              <Text style={[styles.billingDate, { color: colors.text }]}>Dec 2024</Text>
              <Text style={[styles.billingDesc, { color: colors.textSecondary }]}>
                Pro Plan Subscription
              </Text>
            </View>
            <Text style={[styles.billingAmount, { color: colors.success }]}>$9.99</Text>
          </View>
          
          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All Transactions
            </Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.border , borderWidth: 1, borderRadius: 16, padding: 16, backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
           Collections • Built with ❤️ by Acyrx &copy; 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea:{
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  themeSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  menuSection: {
    marginBottom: 20,
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  billingSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billingInfo: {
    flex: 1,
  },
  billingDate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  billingDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  billingAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
})