import { Redirect, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, refreshUser } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!user && !isLoading && refreshUser) {
      refreshUser();
    }
  }, [user, isLoading, refreshUser]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}