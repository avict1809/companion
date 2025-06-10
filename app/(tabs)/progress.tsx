import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, Calendar, Target, Award, ChevronRight, BarChart3, User } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const { user } = useAuth();
const userId = user?.userId;


const { width } = Dimensions.get('window');

//fetching subjects
const fetchSubjects = async () => {
  const { data, error } = await supabase
    .from('companions')
    .select('subject, duration, name')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching subjects:', error);
    return;
  }

  // Example logic: treat duration as progress (or adjust as needed)
  const mappedSubjects = data.map(subjectRow => ({
    name: subjectRow.subject,
    progress: Math.min((subjectRow.duration / 60) * 10, 100), // fake progress scale
    sessions: Math.floor(subjectRow.duration / 15), // fake session count based on duration
    color: colors.primary, // you can map colors as needed
  }));

  setSubjects(mappedSubjects);
};

//fecthing stats
const fetchStats = async () => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('created_at, chat_log')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching stats:', error);
    return;
  }

  setSessionCount(data.length);

  // Example streak logic: count distinct dates
  const dates = data.map(row =>
    new Date(row.created_at).toISOString().split('T')[0]
  );

  const uniqueDates = Array.from(new Set(dates)).sort().reverse();

  // Calculate streak
  let currentStreak = 0;
  let yesterday = new Date();

  for (let dateStr of uniqueDates) {
    const date = new Date(dateStr);
    const diff = Math.floor(
      (yesterday - date) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0 || diff === 1) {
      currentStreak += 1;
      yesterday = date;
    } else {
      break;
    }
  }

  setStreak(currentStreak);

  // Example total hours (assuming 1 session ~ 15 mins):
  setTotalHours(Math.round((data.length * 15) / 60));
};


// Fetching weekly data
const fetchWeeklyData = async () => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // last 7 days

  if (error) {
    console.error('Error fetching weekly data:', error);
    return;
  }

  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekData = Array(7).fill(0);

  data.forEach(row => {
    const day = new Date(row.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    weekData[dayMap[day]] += 1;
  });

  const formattedData = Object.keys(dayMap).map((day, index) => ({
    day,
    sessions: weekData[index],
    accuracy: 0, // No accuracy in your schema, so leave 0 or parse chat_log if you add score data
  }));

  setWeeklyData(formattedData);
};


export default function ProgressScreen() {
  useEffect(() => {
    fetchWeeklyData();
    fetchSubjects();
    fetchStats();
  }, []);

  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [weeklyData, setWeeklyData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalHours, setTotalHours] = useState(0);


  const achievements = [
    { title: 'First Week', description: 'Complete 7 days of learning', earned: true },
    { title: 'Perfect Score', description: 'Get 100% on a quiz', earned: true },
    { title: 'Speed Learner', description: 'Complete 5 sessions in one day', earned: false },
    { title: 'Consistency', description: '30 days learning streak', earned: false },
  ];

  const periods = ['week', 'month', 'year'];

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your learning journey
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.primary : 'transparent',
                },
                {
                  borderColor: selectedPeriod === period ? colors.primary : colors.border,
                  borderWidth: 1,
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <View style={[styles.statsContainer, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>87%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg. Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>7</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.secondary }]}>45</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hours</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={[styles.chartSection, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Activity</Text>
            <BarChart3 size={20} color={colors.primary} />
          </View>

          <View style={styles.chart}>
            {weeklyData.map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (data.sessions / maxSessions) * 60,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
                <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
                  {data.day}
                </Text>
                <Text style={[styles.chartValue, { color: colors.text }]}>
                  {data.sessions}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subject Progress */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Subject Progress</Text>
          {subjects.map((subject, index) => (
            <View
              key={index}
              style={[styles.subjectCard, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, backgroundColor: colors.surface }]}
            >
              <View style={styles.subjectHeader}>
                <Text style={[styles.subjectName, { color: colors.text }]}>
                  {subject.name}
                </Text>
                <Text style={[styles.subjectProgress, { color: subject.color }]}>
                  {subject.progress}%
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]} />
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${subject.progress}%`,
                      backgroundColor: subject.color,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.subjectSessions, { color: colors.textSecondary }]}>
                {subject.sessions} sessions completed
              </Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Achievements</Text>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              style={[
                styles.achievementCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: achievement.earned ? colors.success : colors.border,
                },
              ]}
            >
              <Award
                size={24}
                color={achievement.earned ? colors.success : colors.textSecondary}
                fill={achievement.earned ? colors.success : 'transparent'}
              />
              <View style={styles.achievementText}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                  {achievement.description}
                </Text>
              </View>
              <ChevronRight
                size={16}
                color={achievement.earned ? colors.success : colors.textSecondary}
              />
            </View>
          ))}
        </View>

        {/* Goals */}
        <View style={[styles.goalsSection, { borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }]}>
          <View style={styles.goalsHeader}>
            <Target size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Goals</Text>
          </View>

          <View style={[{ borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, backgroundColor: colors.surface }]}>
            <View style={[styles.goalItem]}>
              <Text style={[styles.goalText, { color: colors.text }]}>
                Complete 20 tutoring sessions
              </Text>
              <Text style={[styles.goalProgress, { color: colors.primary }]}>15/20</Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={[styles.goalText, { color: colors.text }]}>
                Maintain 90% accuracy
              </Text>
              <Text style={[styles.goalProgress, { color: colors.success }]}>87%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0
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
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  chartSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  subjectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  subjectProgress: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    position: 'relative',
  },
  progressBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  subjectSessions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  goalsSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
});