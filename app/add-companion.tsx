import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, BookOpen, User, Code, Music, MessageSquare, Plus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

const SUBJECTS = [
  { id: 'general', name: 'General', icon: BookOpen, color: 'primary' },
  { id: 'personal', name: 'Personal', icon: User, color: 'accent' },
  { id: 'tech', name: 'Tech', icon: Code, color: 'secondary' },
  { id: 'entertainment', name: 'Entertainment', icon: Music, color: 'success' },
  { id: 'custom', name: 'Custom', icon: MessageSquare, color: 'warning' },
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
          topic: companionDescription,
           voice: 'default', // Add default voice
          duration: 0, // Add default duration
          style: 'friendly' // Add default style
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
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/tutor')}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Create Companion</Text>
        </View>

        {/* Subject Selection */}
        <View style={[styles.section, { marginBottom: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Subject</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsRow}
          >
            {SUBJECTS.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectCard,
                  {
                    backgroundColor: selectedSubject === subject.id ? colors[subject.color] : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setSelectedSubject(subject.id)}
                activeOpacity={0.7}
              >
                <subject.icon
                  size={24}
                  color={selectedSubject === subject.id ? colors.text : colors[subject.color]}
                />
                <Text
                  style={[
                    styles.subjectName,
                    {
                      color: selectedSubject === subject.id ? colors.text : colors.text,
                    },
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Companion Details */}
        <View style={[styles.section, { marginBottom: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Companion Details</Text>
          
          <View style={[styles.inputContainer, { borderColor: colors.border, marginBottom: 16 }]}>
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
            paddingVertical: 16,
          }]}
          >
            <TextInput
              style={[styles.input, {
                color: colors.text,
                textAlignVertical: 'top',
                height: '70%',
              }]}
              placeholder="Describe what your companion will be about..."
              placeholderTextColor={colors.textSecondary}
              value={companionDescription}
              onChangeText={setCompanionDescription}
              multiline
              numberOfLines={4}
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
            },
          ]}
          onPress={handleCreateCompanion}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Plus size={20} color={'white'} />
          <Text style={[styles.createButtonText, { color: 'white' }]}>
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
  contentContainer: {
    padding: 20,
    paddingTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  section: {},
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 5,
  },
  subjectsRow: {
    paddingHorizontal: 4,
  },
  subjectCard: {
    width: 80,
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
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
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});