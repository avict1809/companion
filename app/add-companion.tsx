import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Mic, BookOpen, User, Code, Music, MessageSquare, Plus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

const SUBJECTS = [
  { id: 'general', name: 'General Knowledge', icon: BookOpen },
  { id: 'personal', name: 'Personal Assistant', icon: User },
  { id: 'tech', name: 'Technology', icon: Code },
  { id: 'entertainment', name: 'Entertainment', icon: Music },
  { id: 'custom', name: 'Custom Topic', icon: MessageSquare },
];

export default function NewCompanionScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [companionDescription, setCompanionDescription] = useState('');
  const [companionName, setCompanionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCompanion = async () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    if (!companionName.trim()) {
      Alert.alert('Error', 'Please give your companion a name');
      return;
    }

    if (!companionDescription.trim()) {
      Alert.alert('Error', 'Please describe your companion');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('companions')
        .insert([{
          user_id: user?.id,
          name: companionName,
          subject: selectedSubject,
          topic: companionDescription, // Map description -> topic
        }])
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Success',
        'Your companion has been created!',
        [{ text: 'OK', onPress: () => router.replace(`/companion/${data.id}`) }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create companion');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>New Voice Companion</Text>
        </View>

        {/* Subject Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose a Subject</Text>
          <View style={styles.subjectGrid}>
            {SUBJECTS.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectCard,
                  {
                    backgroundColor: selectedSubject === subject.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }
                ]}
                onPress={() => setSelectedSubject(subject.id)}
                activeOpacity={0.7}
              >
                <subject.icon
                  size={24}
                  color={selectedSubject === subject.id ? colors.surface : colors.text}
                />
                <Text
                  style={[
                    styles.subjectName,
                    { color: selectedSubject === subject.id ? colors.surface : colors.text }
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Companion Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Companion Details</Text>

          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Companion name"
              placeholderTextColor={colors.textSecondary}
              value={companionName}
              onChangeText={setCompanionName}
            />
          </View>

          <View style={[styles.inputContainer, {
            borderColor: colors.border,
            minHeight: 120,
          }]}>
            <TextInput
              style={[styles.input, {
                color: colors.text,
                textAlignVertical: 'top',
                height: '100%',
              }]}
              placeholder="Describe what your companion will be about..."
              placeholderTextColor={colors.textSecondary}
              value={companionDescription}
              onChangeText={setCompanionDescription}
              multiline
            />
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: colors.primary,
              opacity: isLoading ? 0.7 : 1,
            }
          ]}
          onPress={handleCreateCompanion}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Plus size={20} color={colors.surface} />
          <Text style={[styles.createButtonText, { color: colors.surface }]}>
            {isLoading ? 'Creating...' : 'Create Companion'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  subjectName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});