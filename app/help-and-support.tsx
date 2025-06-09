import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  FileText,
  Globe,
  ChevronRight,
  ArrowLeft,
  Phone,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function HelpSupportScreen({}) {
  const { colors, isDark } = useTheme();

  const helpOptions = [
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Find answers to common questions',
      action: () => navigation.navigate('FAQs'),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Contact us via email',
      action: () => Linking.openURL('mailto:support@collections.com'),
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => navigation.navigate('LiveChat'),
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      action: () => Linking.openURL('tel:+15551234567'),
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'User guides and tutorials',
      action: () => Linking.openURL('https://docs.collections.com'),
    },
    {
      icon: Globe,
      title: 'Community',
      description: 'Join our user community',
      action: () => Linking.openURL('https://community.collections.com'),
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
            <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We're here to help you
            </Text>
          </View>
        </View>

        {/* Help Options */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          {helpOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem, 
                { 
                  borderBottomWidth: index === helpOptions.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                }
              ]}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
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

        {/* Contact Info */}
        <View style={[styles.contactSection, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          
          <View style={styles.contactInfo}>
            <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Email:</Text>
            <Text style={[styles.contactValue, { color: colors.text }]}>support@collections.com</Text>
          </View>
          
          <View style={styles.contactInfo}>
            <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Phone:</Text>
            <Text style={[styles.contactValue, { color: colors.text }]}>+1 (555) 123-4567</Text>
          </View>
          
          <View style={styles.contactInfo}>
            <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Hours:</Text>
            <Text style={[styles.contactValue, { color: colors.text }]}>Mon-Fri, 9AM-5PM EST</Text>
          </View>
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
  contactSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
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