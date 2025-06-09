import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Mail,
  Smartphone,
  Lock,
  Globe,
  CreditCard,
  Bell,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function AccountSettingsScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const accountSections = [
    {
      title: 'Profile Information',
      options: [
        {
          icon: User,
          label: 'Personal Details',
          route: 'PersonalDetails',
        },
        {
          icon: Mail,
          label: 'Email Address',
          route: 'EmailSettings',
        },
        {
          icon: Smartphone,
          label: 'Phone Number',
          route: 'PhoneSettings',
        },
      ],
    },
    {
      title: 'Security',
      options: [
        {
          icon: Lock,
          label: 'Password',
          route: 'PasswordSettings',
        },
        {
          icon: Globe,
          label: 'Connected Accounts',
          route: 'ConnectedAccounts',
        },
      ],
    },
    {
      title: 'Preferences',
      options: [
        {
          icon: Bell,
          label: 'Notifications',
          route: 'NotificationSettings',
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          route: 'PaymentMethods',
        },
      ],
    },
  ];

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
            <Text style={[styles.title, { color: colors.text }]}>Account Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your account preferences
            </Text>
          </View>
        </View>

        {/* Account Sections */}
        {accountSections.map((section, sectionIndex) => (
          <View 
            key={sectionIndex} 
            style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            
            {section.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionItem, 
                  { 
                    borderBottomWidth: optionIndex === section.options.length - 1 ? 0 : 1,
                    borderBottomColor: colors.border,
                  }
                ]}
                onPress={() => navigation.navigate(option.route)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <option.icon size={20} color={colors.textSecondary} />
                  <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                </View>
                <ChevronRight size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
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