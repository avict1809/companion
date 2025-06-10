import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Mic, ArrowLeft, ChevronRight, Trash2, Edit3 } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Companion = {
  id: string;
  name: string;
  subject: string;
  topic: string;
  style?: string | null;
  voice: string;
  duration: number;
  user_id: string;
  created_at: string;
  isUpdated: boolean;
  profiles?: {
    username: string | null;
  };
};

export default function CompanionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCompanion = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('companions')
          .select('*, profiles(username)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCompanion(data);
      } catch (error) {
        console.error('Error fetching companion:', error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanion();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('companions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      router.back();
    } catch (error) {
      console.error('Error deleting companion:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/companion/${id}/edit`);
  };

  const startChat = () => {
    alert(`Chatting with ${companion?.name}`);
  };

  if (isLoading || !companion) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading companion...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/(tabs)/tutor')}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{companion.name}</Text>
        </View>

        {/* Companion Info */}
        <View style={[
          styles.companionInfo,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          }
        ]}>
          <View style={styles.companionMeta}>
            <View style={[
              styles.companionIcon,
              { backgroundColor: `${colors.primary}20` }
            ]}>
              <Mic size={24} color={colors.primary} />
            </View>
            <View style={styles.companionText}>
              <Text style={[styles.companionSubject, { color: colors.textSecondary }]}>
                {companion.subject} • {companion.topic}
              </Text>
              <Text style={[styles.companionCreated, { color: colors.textSecondary }]}>
                Created: {new Date(companion.created_at).toLocaleDateString()}
              </Text>
              <Text style={[styles.companionCreated, { color: colors.textSecondary }]}>
                By: {companion.profiles?.username ?? 'Unknown'}
              </Text>
            </View>
          </View>

          <Text style={[styles.companionDescription, { color: colors.text }]}>
            Style: {companion.style ?? 'N/A'}
            {"\n"}
            Voice: {companion.voice}
            {"\n"}
            Duration: {companion.duration} seconds
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.primary,
                borderColor: colors.border,
                borderWidth: 1,
              }
            ]}
            onPress={startChat}
            activeOpacity={0.8}
          >
            <Mic size={20} color={"white"} />
            <Text style={[styles.actionText, { color: 'white' }]}>
              Start Voice Chat
            </Text>
            <ChevronRight size={20} color={"white"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }
            ]}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Edit3 size={20} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Edit Companion
            </Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              }
            ]}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>
              {isDeleting ? 'Deleting...' : 'Delete Companion'}
            </Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  companionInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  companionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  companionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companionText: {
    flex: 1,
    justifyContent: 'center',
  },
  companionSubject: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  companionCreated: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  companionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
});
