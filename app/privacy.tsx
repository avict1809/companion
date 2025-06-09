import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import {
  Shield,
  Lock,
  EyeOff,
  User,
  Mail,
  CreditCard,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacySettingsScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const privacyOptions = [
    {
      icon: Lock,
      title: 'Account Security',
      description: 'Two-factor authentication and password',
      route: 'AccountSecurity',
    },
    {
      icon: EyeOff,
      title: 'Data Privacy',
      description: 'Control what data we collect',
      route: 'DataPrivacy',
    },
    {
      icon: User,
      title: 'Profile Visibility',
      description: 'Who can see your profile information',
      route: 'ProfileVisibility',
    },
    {
      icon: Mail,
      title: 'Email Preferences',
      description: 'Manage marketing communications',
      route: 'EmailPreferences',
    },
    {
      icon: CreditCard,
      title: 'Payment Security',
      description: 'Manage saved payment methods',
      route: 'PaymentSecurity',
    },
  ];

  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [personalizedAds, setPersonalizedAds] = React.useState(false);

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Privacy Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Control your data and security
            </Text>
          </View>
        </View>

        {/* Privacy Controls */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy Controls</Text>
          
          <View style={[styles.controlItem, { borderBottomColor: colors.border }]}>
            <View style={styles.controlInfo}>
              <Shield size={20} color={colors.text} />
              <Text style={[styles.controlLabel, { color: colors.text }]}>Enable Analytics</Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : colors.surface}
            />
          </View>
          
          <View style={styles.controlItem}>
            <View style={styles.controlInfo}>
              <EyeOff size={20} color={colors.text} />
              <Text style={[styles.controlLabel, { color: colors.text }]}>Personalized Ads</Text>
            </View>
            <Switch
              value={personalizedAds}
              onValueChange={setPersonalizedAds}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : colors.surface}
            />
          </View>
        </View>

        {/* Privacy Options */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy Options</Text>
          
          {privacyOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionItem, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate(option.route)}
              activeOpacity={0.7}
            >
              <View style={styles.optionInfo}>
                <option.icon size={20} color={colors.textSecondary} />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Data Management */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
          
          <TouchableOpacity
            style={[styles.dataAction, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.dataActionText, { color: colors.text }]}>Export My Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dataAction}
            activeOpacity={0.7}
          >
            <Text style={[styles.dataActionText, { color: colors.error }]}>Delete My Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Collections • Built with ❤️ by Acyrx &copy; 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  controlItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  dataAction: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dataActionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});