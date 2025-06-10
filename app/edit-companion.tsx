import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

const VOICE_OPTIONS = [
  { label: 'Male Voice 1', value: 'male-1' },
  { label: 'Male Voice 2', value: 'male-2' },
  { label: 'Female Voice 1', value: 'female-1' },
  { label: 'Female Voice 2', value: 'female-2' },
  { label: 'Neutral Voice', value: 'neutral' },
];

export default function EditCompanionScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [companion, setCompanion] = useState({
    name: '',
    subject: '',
    topic: '',
    voice: 'male-1',
    style: 'friendly'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const { data, error } = await supabase
          .from('companions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCompanion(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch companion details');
      }
    };

    fetchCompanion();
  }, [id]);

  const handleUpdateCompanion = async () => {
    if (!companion.name.trim()) {
      Alert.alert('Error', 'Please give your companion a name');
      return;
    }

    if (!companion.topic.trim()) {
      Alert.alert('Error', 'Please describe your companion');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('companions')
        .update({
          name: companion.name,
          topic: companion.topic,
          voice: companion.voice,
          style: companion.style,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Companion updated successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update companion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompanion = async () => {
    Alert.alert(
      'Delete Companion',
      'Are you sure you want to delete this companion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('companions')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('Success', 'Companion deleted successfully!');
              router.replace('/tutor');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete companion');
            }
          }
        }
      ]
    );
  };

  const pickerSelectStyles = {
    inputIOS: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingRight: 30,
    },
    inputAndroid: {
      color: colors.text,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingRight: 30,
    },
    iconContainer: {
      top: 10,
      right: 12,
    },
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Edit Companion</Text>
          </View>

          {/* Companion Details */}
          <View style={[styles.section, { marginBottom: 1 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Companion Details</Text>
            
            <View style={[styles.inputContainer, { borderColor: colors.border, marginBottom: 16 }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Companion name"
                placeholderTextColor={colors.textSecondary}
                value={companion.name}
                onChangeText={(text) => setCompanion({...companion, name: text})}
                returnKeyType="next"
              />
            </View>

            {/* Voice Selection Dropdown */}
            <View style={[styles.inputContainer, { borderColor: colors.border, marginBottom: 16 }]}>
              <RNPickerSelect
                onValueChange={(value) => setCompanion({...companion, voice: value})}
                items={VOICE_OPTIONS}
                value={companion.voice}
                style={{
                  ...pickerSelectStyles,
                  inputIOS: {
                    ...pickerSelectStyles.inputIOS,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                  inputAndroid: {
                    ...pickerSelectStyles.inputAndroid,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                }}
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
                  height: '100%',
                }]}
                placeholder="Describe what your companion will be about..."
                placeholderTextColor={colors.textSecondary}
                value={companion.topic}
                onChangeText={(text) => setCompanion({...companion, topic: text})}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleUpdateCompanion}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Save size={20} color={'white'} />
              <Text style={[styles.buttonText, { color: 'white' }]}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  borderColor: colors.error,
                },
              ]}
              onPress={handleDeleteCompanion}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.buttonText, { color: colors.error }]}>
                Delete Companion
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  buttonGroup: {
    marginTop: 20,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});