import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Plus, Play, Pause, Brain } from 'lucide-react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useCompanions } from '@/hooks/useCompanion';

export default function TutorScreen() {
  const { colors, isDark } = useTheme();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const scale = useSharedValue(1);
  const { companions, loading } = useCompanions();

  const recentSessions = [
    { subject: 'Algebra', duration: '25 min', date: 'Today', score: '92%' },
    { subject: 'Physics', duration: '30 min', date: 'Yesterday', score: '88%' },
    { subject: 'Literature', duration: '20 min', date: '2 days ago', score: '95%' },
  ];

  const toggleCreateCompanion = () => {
    scale.value = withSpring(1.1);
    setTimeout(() => scale.value = withSpring(1), 200);
    router.replace('/add-companion');
  };
  const navigateToCompanion = (id: string) => {
    router.push(`/companion/${id}`);
  };

  const micButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>AI Tutor</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Have a conversation with your personal AI tutor
          </Text>
        </View>

        {/* Create Companion */}
        <View
          style={[
            styles.voiceSection,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Create Companion</Text>

          <View style={styles.voiceInterface}>
            <Animated.View style={[micButtonStyle]}>
              <TouchableOpacity
                style={[
                  styles.micButton,
                  {
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                  },
                ]}
                onPress={toggleCreateCompanion}
                activeOpacity={0.8}
              >
                <Plus size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>

            <Text style={[styles.voiceStatus, { color: colors.text }]}>
              Tap to create a new companion
            </Text>

            {isSessionActive && (
              <View style={styles.sessionControls}>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.accent }]}
                  activeOpacity={0.7}
                >
                  <Play size={16} color="#FFFFFF" />
                  <Text style={styles.controlText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.textSecondary }]}
                  activeOpacity={0.7}
                >
                  <Pause size={16} color="#FFFFFF" />
                  <Text style={styles.controlText}>Pause</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Recent Companions */}
        <View
          style={[
            styles.section,
            {
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Companions</Text>
            <TouchableOpacity onPress={() => router.replace('/companions')}>
              <Text style={[styles.viewMore, { color: colors.primary }]}>View More</Text>
            </TouchableOpacity>
          </View>

          {companions.slice(0, 3).map((companion, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sessionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => navigateToCompanion(companion.id)}
            >
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionSubject, { color: colors.text }]}>
                  {companion.name}
                </Text>
                <Text style={[styles.sessionScore, { color: colors.success }]}>{companion.subject}</Text>
              </View>
              <View style={styles.sessionMeta}>
                <Text style={[styles.sessionDuration, { color: colors.textSecondary }]}>
                  {companion.topic}
                </Text>
                <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                  {companion.style}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Sessions */}
        <View
          style={[
            styles.section,
            {
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Sessions</Text>
          {recentSessions.map((session, index) => (
            <View
              key={index}
              style={[
                styles.sessionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionSubject, { color: colors.text }]}>
                  {session.subject}
                </Text>
                <Text style={[styles.sessionScore, { color: colors.success }]}>{session.score}</Text>
              </View>
              <View style={styles.sessionMeta}>
                <Text style={[styles.sessionDuration, { color: colors.textSecondary }]}>
                  {session.duration}
                </Text>
                <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                  {session.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  voiceSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewMore: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  voiceInterface: {
    alignItems: 'center',
    width: '100%',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceStatus: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
    marginBottom: 8,
  },
  webNotice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    textAlign: 'center',
  },
  sessionControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 24,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionSubject: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  sessionScore: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sessionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});