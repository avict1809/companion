import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Bell, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NotificationSettingsScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const notificationSections = [
    {
      title: 'App Notifications',
      options: [
        { label: 'New Messages', description: 'Get notified when you receive new messages', value: true },
        { label: 'Collection Updates', description: 'Get notified when collections are updated', value: false },
        { label: 'Announcements', description: 'Get notified about app updates and new features', value: true },
      ],
    },
    {
      title: 'Email Notifications',
      options: [
        { label: 'Weekly Digest', description: 'Get a weekly summary of your activity', value: false },
        { label: 'Promotional Offers', description: 'Get notified about special offers', value: true },
      ],
    },
    {
      title: 'Push Notifications',
      options: [
        { label: 'Sound', description: 'Play sound for notifications', value: true },
        { label: 'Vibration', description: 'Vibrate for notifications', value: true },
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
            <Text style={[styles.title, { color: colors.text }]}>Notification Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your notification preferences
            </Text>
          </View>
        </View>

        {/* Notification Sections */}
        {notificationSections.map((section, sectionIndex) => (
          <View 
            key={sectionIndex} 
            style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              {sectionIndex === 0 && (
                <Bell size={20} color={colors.primary} />
              )}
            </View>
            
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
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={option.value ? colors.primary : colors.textSecondary}
                  value={option.value}
                  onValueChange={() => console.log('Toggle changed')}
                />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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