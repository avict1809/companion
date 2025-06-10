import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, BookOpen, FileText, BarChart3, Clock, Star, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';


export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [companions, setCompanions] = useState<any[]>([]);
  const [userName, setUserName] = useState('');

  // Fetch companions + user profile
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserName(profileData?.username || '');

        // 2️⃣ Fetch companions
        const { data: companionsData, error: companionsError } = await supabase
          .from('companions')
          .select('id, name, subject, topic, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (companionsError) throw companionsError;
        setCompanions(companionsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.id]);

  const { colors, isDark } = useTheme();

  const quickActions = [
    { icon: Zap, title: 'Start Tutoring', subtitle: 'Begin AI session', color: colors.primary, link: '/tutor' },
    { icon: FileText, title: 'Summarize PDF', subtitle: 'Upload & analyze', color: colors.accent, link: '/pdf-tools' },
    { icon: BookOpen, title: 'Generate Quiz', subtitle: 'Test knowledge', color: colors.secondary, link: '/pdf-tools' },
    { icon: BarChart3, title: 'View Progress', subtitle: 'Check stats', color: colors.success, link: '/progress' },
  ];

  const recentActivities = [
    { title: 'Math Tutoring Session', time: '2 hours ago', subject: 'Algebra', duration: '25 min' },
    { title: 'History PDF Summary', time: '5 hours ago', subject: 'World War II', pages: '12 pages' },
    { title: 'Science Quiz', time: '1 day ago', subject: 'Physics', score: '85%' },
    { title: 'Literature Discussion', time: '2 days ago', subject: 'Shakespeare', duration: '30 min' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {/* SafeAreaView only for top safe area */}
      <SafeAreaView edges={['top']} style={styles.safeArea}>
      </SafeAreaView>

      {/* Main content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Progress Overview */}
        <View style={styles.topBar}>
          <View style={styles.topBarText}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {userName ? `Hello ${userName}! 👋` : 'Hello! 👋'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Ready to learn something new?</Text>
          </View>
          <View style={styles.topBarIcons}>
            <TouchableOpacity onPress={() => { /* handle notifications */ }} style={styles.iconButton}>
              {/* Replace with your Notifications icon e.g. Bell */}
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileButton}>
              <View style={[styles.profilePic, { borderColor: colors.border }]} />
            </TouchableOpacity>
          </View>
        </View>


        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Sessions</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: colors.accent }]}>8</Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>PDFs</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: colors.success }]}>94%</Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Accuracy</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={[styles.progressNumber, { color: colors.secondary }]}>245</Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Credits</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1, borderBlockColor: colors.border, borderRadius: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
                activeOpacity={0.7}
                onPress={() => router.push(action.link)}
              >
                <action.icon size={28} color={action.color} />
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Companions</Text>
          {companions.length === 0 ? (
            <Text style={{ color: colors.textSecondary, fontFamily: 'Inter-Regular' }}>
              No companions yet. Create one!
            </Text>
          ) : (
            companions.map((companion) => (
              <View
                key={companion.id}
                style={[styles.activityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.activityHeader}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {companion.name}
                  </Text>
                  <View style={styles.activityMeta}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                      {new Date(companion.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activitySubject, { color: colors.primary }]}>
                    {companion.subject}
                  </Text>
                  <Text style={[styles.activityInfo, { color: colors.textSecondary }]}>
                    {companion.topic}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Achievements */}
        <View style={[styles.section, { borderColor: colors.border, borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Achievement</Text>
          <View style={[styles.achievementCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 12 }]}>
            <Star size={24} color={colors.warning} fill={colors.warning} />
            <View style={styles.achievementText}>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>Learning Streak!</Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                You've completed 7 days in a row
              </Text>
            </View>
          </View>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    // Removed padding here so sections align
  },
  section: {
    marginBottom: 24,
    padding: 20, // adds horizontal padding consistently
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 20, // aligns with other sections
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 12,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activitySubject: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  activityInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  ttopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  topBarText: {
    flex: 1,
    paddingRight: 12,
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  profileButton: {
    marginLeft: 12,
    padding: 4,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc', // placeholder color
    borderWidth: 1,
  },


});
