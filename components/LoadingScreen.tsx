import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      rotation.value,
      [0, 90, 180, 270, 360],
      [1, 0.3, 1, 0.3, 1]
    );
    return { opacity };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.loader, animatedStyle]}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
      </Animated.View>
      <Animated.Text style={[styles.message, { color: colors.text }, dotStyle]}>
        {message}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 24,
  },
});

export default LoadingScreen;