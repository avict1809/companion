import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { resetPassword } from '@/lib/auth';
import { router } from 'expo-router';

export default function ResetPasswordScreen() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Reset Error', error.message);
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
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {emailSent ? 'Check your email' : 'Reset password'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {emailSent 
              ? `We sent a password reset link to ${email}`
              : 'Enter your email to receive a reset link'}
          </Text>
        </View>

        {!emailSent ? (
          <>
            {/* Form */}
            <View style={styles.form}>
              <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email address"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleReset}
                disabled={isLoading || !email}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Remember your password?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.footerLink, { color: colors.primary }]}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Success State */}
            <View style={styles.successContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/login')}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                style={styles.resendLink}
              >
                <Text style={[styles.resendText, { color: colors.primary }]}>
                  Didn't receive email? Resend
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    padding: 24,
    paddingTop: 16,
  },
  header: {
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    maxWidth: 300,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendLink: {
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});