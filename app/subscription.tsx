import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Crown,
  Check,
  ChevronRight,
  ArrowRight,
  Gem,
  Sparkles,
  Mic,
  ArrowLeft,
} from 'lucide-react-native';

export default function SubscriptionScreen() {
  const { colors, isDark } = useTheme();

  const plans = [
    {
      id: 'learner',
      title: 'Learner',
      price: '$19',
      period: 'per month',
      annualPrice: '$190',
      features: [
        'Basic AI features',
        '20 credits/day',
        'Standard models',
        'Email support',
        'Voice calls: $1/min',
      ],
      cta: 'Get Started',
      active: false,
      highlight: false,
    },
    {
      id: 'scholar',
      title: 'Scholar',
      price: '$49',
      period: 'per month',
      annualPrice: '$490',
      features: [
        'Advanced AI features',
        '50 credits/day',
        'Premium models',
        'Priority support',
        'Voice calls: $0.75/min',
        'Early access to features',
      ],
      cta: 'Popular Choice',
      active: false,
      highlight: true,
    },
    {
      id: 'master',
      title: 'Master',
      price: '$69',
      period: 'per month',
      annualPrice: '$600',
      features: [
        'All premium features',
        'Unlimited credits',
        'Exclusive models',
        '24/7 VIP support',
        'Voice calls: $0.50/min',
        'Beta access to features',
        'Personal AI assistant',
      ],
      cta: 'Best Value',
      active: false,
      highlight: false,
    },
  ];

  const addOns = [
    {
      id: 'voice',
      title: 'Voice Calls',
      price: '$1',
      period: 'per minute',
      features: [
        'High quality voice calls',
        'Pay-as-you-go',
        'No commitment',
      ],
      icon: Mic,
      color: colors.primary,
    },
    {
      id: 'transcript',
      title: 'Transcripts',
      price: '$0.25',
      period: 'per minute',
      features: [
        'Automatic call transcripts',
        'Searchable history',
        'Export to PDF',
      ],
      icon: Gem,
      color: colors.success,
    },
    {
      id: 'recording',
      title: 'Call Recording',
      price: '$0.50',
      period: 'per minute',
      features: [
        'Cloud recordings',
        'Unlimited storage',
        'Playback controls',
      ],
      icon: Sparkles,
      color: colors.warning,
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {router.back()}}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Subscription</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Choose the plan that fits you best
            </Text>
          </View>
        </View>
        
        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                {
                  borderColor: plan.highlight ? colors.primary : colors.border,
                  borderWidth: plan.highlight ? 2 : 1,
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  padding: 16,
                },
              ]}
            >
              {plan.highlight && (
                <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.recommendedBadgeText}>Recommended</Text>
                </View>
              )}
              <Text style={[styles.planTitle, { color: colors.text }]}>{plan.title}</Text>
              
              <View style={styles.priceToggleContainer}>
                <View style={styles.priceOption}>
                  <Text style={[styles.priceOptionLabel, { color: colors.textSecondary }]}>Monthly</Text>
                  <View style={styles.planPriceContainer}>
                    <Text style={[styles.planPrice, { color: colors.text }]}>{plan.price}</Text>
                    <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                      /month
                    </Text>
                  </View>
                </View>
                
                <View style={styles.priceOption}>
                  <Text style={[styles.priceOptionLabel, { color: colors.textSecondary }]}>Annual</Text>
                  <View style={styles.planPriceContainer}>
                    <Text style={[styles.planPrice, { color: colors.text }]}>{plan.annualPrice}</Text>
                    <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                      /year
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, i) => (
                  <View key={i} style={styles.planFeature}>
                    <Check size={16} color={colors.success} />
                    <Text style={[styles.planFeatureText, { color: colors.text }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.planButton,
                  {
                    backgroundColor: plan.highlight ? colors.primary : colors.surface,
                    borderColor: plan.highlight ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.planButtonText,
                    {
                      color: plan.highlight ? 'white' : colors.text,
                    },
                  ]}
                >
                  {plan.cta}
                </Text>
                <ArrowRight size={16} color={ plan.highlight? 'white' : colors.text} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add-ons Section */}
        <View style={[styles.addOnsSection, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Add-ons</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Enhance your experience with these premium features
          </Text>
          
          <View style={styles.addOnsGrid}>
            {addOns.map((addOn) => (
              <View 
                key={addOn.id}
                style={[styles.addOnCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12 }]}
              >
                <View style={[styles.addOnIcon, { backgroundColor: `${addOn.color}20` }]}>
                  <addOn.icon size={20} color={addOn.color} />
                </View>
                <Text style={[styles.addOnTitle, { color: colors.text }]}>{addOn.title}</Text>
                <View style={styles.addOnPriceContainer}>
                  <Text style={[styles.addOnPrice, { color: colors.text }]}>{addOn.price}</Text>
                  <Text style={[styles.addOnPeriod, { color: colors.textSecondary }]}>
                    {addOn.period}
                  </Text>
                </View>
                <View style={styles.addOnFeatures}>
                  {addOn.features.map((feature, i) => (
                    <View key={i} style={styles.addOnFeature}>
                      <Check size={14} color={colors.success} />
                      <Text style={[styles.addOnFeatureText, { color: colors.textSecondary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.addOnButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.addOnButtonText, { color: isDark ? colors.text : 'white' }]}>
                    Add to Plan
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Need help? Contact our support team
          </Text>
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
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    position: 'relative',
    paddingTop: 24,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  priceToggleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  priceOption: {
    flex: 1,
  },
  priceOptionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  planFeatures: {
    gap: 12,
    marginBottom: 24,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  planButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  addOnsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  addOnsGrid: {
    gap: 12,
  },
  addOnCard: {
    padding: 16,
    gap: 12,
  },
  addOnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  addOnPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  addOnPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  addOnPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  addOnFeatures: {
    gap: 8,
  },
  addOnFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addOnFeatureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  addOnButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addOnButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});