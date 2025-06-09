import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Mic, MicOff, Play, Pause, MessageSquare, Brain, Book, Calculator, Globe, Beaker } from 'lucide-react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

export default function TutorScreen() {
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const scale = useSharedValue(1);

  const subjects = [
    { icon: Calculator, name: 'Mathematics', color: colors.primary },
    { icon: Beaker, name: 'Science', color: colors.accent },
    { icon: Book, name: 'Literature', color: colors.secondary },
    { icon: Globe, name: 'History', color: colors.success },
    { icon: Brain, name: 'General', color: colors.warning },
  ];

  const recentSessions = [
    { subject: 'Algebra', duration: '25 min', date: 'Today', score: '92%' },
    { subject: 'Physics', duration: '30 min', date: 'Yesterday', score: '88%' },
    { subject: 'Literature', duration: '20 min', date: '2 days ago', score: '95%' },
  ];

  const toggleRecording = () => {
    if (Platform.OS === 'web') {
      // Web fallback - just toggle visual state
      setIsRecording(!isRecording);
      setIsSessionActive(true);
      scale.value = withSpring(isRecording ? 1 : 1.1);
    } else {
      // Mobile implementation would include actual voice recording
      setIsRecording(!isRecording);
      setIsSessionActive(true);
      scale.value = withSpring(isRecording ? 1 : 1.1);
    }
  };

  const micButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>AI Tutor</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Have a conversation with your personal AI tutor
          </Text>
        </View>

        {/* Voice Interface */}
        <View style={[styles.voiceSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Voice Session</Text>
          
          <View style={styles.voiceInterface}>
            <Animated.View style={[micButtonStyle]}>
              <TouchableOpacity
                style={[
                  styles.micButton,
                  {
                    backgroundColor: isRecording ? colors.error : colors.primary,
                    shadowColor: isRecording ? colors.error : colors.primary,
                  },
                ]}
                onPress={toggleRecording}
                activeOpacity={0.8}
              >
                {isRecording ? (
                  <MicOff size={32} color="#FFFFFF" />
                ) : (
                  <Mic size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <Text style={[styles.voiceStatus, { color: colors.text }]}>
              {isRecording ? 'Listening...' : 'Tap to start speaking'}
            </Text>
            
            {Platform.OS === 'web' && (
              <Text style={[styles.webNotice, { color: colors.textSecondary }]}>
                Voice features available on mobile
              </Text>
            )}
            
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

        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsRow}>
            {subjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.subjectCard, { backgroundColor: colors.surface }]}
                activeOpacity={0.7}
              >
                <subject.icon size={24} color={subject.color} />
                <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <MessageSquare size={20} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Start New Session</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <Brain size={20} color={colors.secondary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Continue Previous</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Sessions</Text>
          {recentSessions.map((session, index) => (
            <View
              key={index}
              style={[styles.sessionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionSubject, { color: colors.text }]}>{session.subject}</Text>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
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
  subjectsRow: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  subjectCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  subjectName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
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