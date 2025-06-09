import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Upload, FileText, MessageSquare, BookOpen, Download, Trash2, Eye, Zap } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function PDFToolsScreen() {
  const { colors } = useTheme();
  const [currentPDF, setCurrentPDF] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recentPDFs = [
    {
      name: 'Mathematics Textbook Ch.5',
      size: '2.3 MB',
      pages: 24,
      uploadDate: '2 hours ago',
      status: 'processed',
    },
    {
      name: 'History Assignment',
      size: '1.8 MB',
      pages: 12,
      uploadDate: '1 day ago',
      status: 'processed',
    },
    {
      name: 'Science Research Paper',
      size: '4.1 MB',
      pages: 35,
      uploadDate: '3 days ago',
      status: 'processing',
    },
  ];

  const pdfActions = [
    {
      icon: Zap,
      title: 'AI Summarize',
      subtitle: 'Get key points',
      color: colors.primary,
      action: 'summarize',
    },
    {
      icon: BookOpen,
      title: 'Generate Quiz',
      subtitle: 'Test knowledge',
      color: colors.secondary,
      action: 'quiz',
    },
    {
      icon: MessageSquare,
      title: 'PDF Chat',
      subtitle: 'Ask questions',
      color: colors.accent,
      action: 'chat',
    },
    {
      icon: Eye,
      title: 'View PDF',
      subtitle: 'Read content',
      color: colors.success,
      action: 'view',
    },
  ];

  const pickDocument = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web fallback - show alert for now
        Alert.alert('Feature Not Available', 'PDF upload is not available on web. Please use the mobile app.');
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        setCurrentPDF(result.assets[0]);
        setIsProcessing(true);
        
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false);
          Alert.alert('Success', 'PDF processed successfully!');
        }, 3000);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleAction = (action: string) => {
    if (!currentPDF) {
      Alert.alert('No PDF', 'Please upload a PDF first');
      return;
    }
    
    switch (action) {
      case 'summarize':
        Alert.alert('AI Summary', 'Generating summary...');
        break;
      case 'quiz':
        Alert.alert('Quiz Generator', 'Creating quiz questions...');
        break;
      case 'chat':
        Alert.alert('PDF Chat', 'Starting chat session...');
        break;
      case 'view':
        Alert.alert('View PDF', 'Opening PDF viewer...');
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>PDF Tools</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Upload, analyze, and interact with your documents
          </Text>
        </View>

        {/* Upload Section */}
        <View style={[styles.uploadSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload PDF</Text>
          
          <TouchableOpacity
            style={[styles.uploadArea, { borderColor: colors.border }]}
            onPress={pickDocument}
            activeOpacity={0.7}
          >
            <Upload size={32} color={colors.primary} />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              Tap to upload PDF
            </Text>
            <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
              Supports files up to 10MB
            </Text>
            {Platform.OS === 'web' && (
              <Text style={[styles.webNotice, { color: colors.warning }]}>
                Note: File upload available on mobile only
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Current PDF */}
        {currentPDF && (
          <View style={[styles.currentPDFSection, { backgroundColor: colors.surface }]}>
            <View style={styles.pdfHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Current PDF</Text>
              <TouchableOpacity
                onPress={() => setCurrentPDF(null)}
                activeOpacity={0.7}
              >
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.pdfCard, { borderColor: colors.border }]}>
              <FileText size={24} color={colors.primary} />
              <View style={styles.pdfInfo}>
                <Text style={[styles.pdfName, { color: colors.text }]}>
                  {currentPDF.name}
                </Text>
                <Text style={[styles.pdfSize, { color: colors.textSecondary }]}>
                  {(currentPDF.size / (1024 * 1024)).toFixed(1)} MB
                </Text>
              </View>
              {isProcessing && (
                <Text style={[styles.processingText, { color: colors.warning }]}>
                  Processing...
                </Text>
              )}
            </View>
          </View>
        )}

        {/* PDF Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
          <View style={styles.actionsGrid}>
            {pdfActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: colors.surface,
                    opacity: currentPDF && !isProcessing ? 1 : 0.5,
                  },
                ]}
                onPress={() => handleAction(action.action)}
                activeOpacity={0.7}
                disabled={!currentPDF || isProcessing}
              >
                <action.icon size={24} color={action.color} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent PDFs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent PDFs</Text>
          {recentPDFs.map((pdf, index) => (
            <View
              key={index}
              style={[styles.recentPDFCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <FileText size={20} color={colors.primary} />
              <View style={styles.recentPDFInfo}>
                <Text style={[styles.recentPDFName, { color: colors.text }]}>
                  {pdf.name}
                </Text>
                <View style={styles.recentPDFMeta}>
                  <Text style={[styles.recentPDFSize, { color: colors.textSecondary }]}>
                    {pdf.size} • {pdf.pages} pages
                  </Text>
                  <Text style={[styles.recentPDFDate, { color: colors.textSecondary }]}>
                    {pdf.uploadDate}
                  </Text>
                </View>
              </View>
              <View style={styles.recentPDFActions}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: pdf.status === 'processed' ? colors.success : colors.warning,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{pdf.status}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Download size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Usage Stats */}
        <View style={[styles.statsSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Usage This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>23</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>PDFs Processed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>45</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Summaries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>18</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Quizzes</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
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
  uploadSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  webNotice: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  currentPDFSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    gap: 12,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  pdfSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  processingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  recentPDFCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  recentPDFInfo: {
    flex: 1,
  },
  recentPDFName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  recentPDFMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentPDFSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  recentPDFDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  recentPDFActions: {
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  statsSection: {
    padding: 20,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
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
    textAlign: 'center',
  },
});