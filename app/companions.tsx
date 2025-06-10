import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Mic, Plus, MessageSquare, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

type Companion = {
  id: string;
  name: string;
  subject: string;
//   description: string;
  created_at: string;
};

export default function CompanionsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchCompanions = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companions')
        .select('id, name, subject, topic, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map topic -> description
      const mappedCompanions = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        subject: item.subject,
        description: item.topic, // Map topic field to description
        created_at: item.created_at,
      }));

      setCompanions(mappedCompanions);
    } catch (error) {
      console.error('Error fetching companions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchCompanions();

  // Real-time subscription (optional — can also update this)
  const subscription = supabase
    .channel('companion_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'companions',
        filter: `user_id=eq.${user?.id}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setCompanions((prev) => [
            {
              id: payload.new.id,
              name: payload.new.name,
              subject: payload.new.subject,
              description: payload.new.topic,
              created_at: payload.new.created_at,
            },
            ...prev,
          ]);
        } else if (payload.eventType === 'DELETE') {
          setCompanions((prev) =>
            prev.filter((c) => c.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, [user?.id]);


  const navigateToCompanion = (id: string) => {
    router.push(`/companion/${id}`);
  };

  const navigateToNewCompanion = () => {
    router.push('/add-companion');
  };

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
          <Text style={[styles.title, { color: colors.text }]}>Your Companions</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select a companion to start chatting
          </Text>
        </View>

        {/* Add New Companion Button */}
        <TouchableOpacity
          style={[
            styles.newCompanionButton,
            { 
              backgroundColor: colors.primary,
              borderColor: colors.border,
              borderWidth: 1,
            }
          ]}
          onPress={navigateToNewCompanion}
          activeOpacity={0.8}
        >
          <Plus size={20} color={colors.surface} />
          <Text style={[styles.newCompanionText, { color: colors.surface }]}>
            Add New Companion
          </Text>
        </TouchableOpacity>

        {/* Companions List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading companions...
            </Text>
          </View>
        ) : companions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You don't have any companions yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your first companion to start chatting
            </Text>
          </View>
        ) : (
          <View style={styles.companionsList}>
            {companions.map((companion) => (
              <TouchableOpacity
                key={companion.id}
                style={[
                  styles.companionCard,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }
                ]}
                onPress={() => navigateToCompanion(companion.id)}
                activeOpacity={0.7}
              >
                <View style={styles.companionHeader}>
                  <View style={[
                    styles.companionIcon,
                    { backgroundColor: `${colors.primary}20` }
                  ]}>
                    <Mic size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.companionName, { color: colors.text }]}>
                    {companion.name}
                  </Text>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </View>
                <Text style={[styles.companionSubject, { color: colors.textSecondary }]}>
                  {companion.subject}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  newCompanionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  newCompanionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  companionsList: {
    gap: 12,
  },
  companionCard: {
    padding: 16,
    borderRadius: 12,
  },
  companionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  companionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companionName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  companionSubject: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  companionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});