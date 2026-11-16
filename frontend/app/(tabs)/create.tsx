import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors as defaultColors, spacing, borderRadius, typography, useTheme } from '../../theme';
import { useAuthStore } from '../../store';
import { postService } from '../../services';
import { Image as ImageIcon, Video, Link as LinkIcon, Smile, AlignLeft, MoreHorizontal } from 'lucide-react-native';

export default function CreateScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { currentUser, isAuthenticated, selectedUniversity } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || !isAuthenticated || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      await postService.createPost({
        content,
        authorId: currentUser.id,
        universityId: selectedUniversity?.id || 'uni_1',
      });
      setContent('');
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestContainer}>
          <Text style={[styles.guestTitle, { color: colors.textPrimary }]}>Sign in to post</Text>
          <Pressable
            style={[styles.guestButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.guestButtonText}>Log In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>New Post</Text>
          <Pressable 
            style={[
              styles.postButton, 
              { backgroundColor: colors.primary },
              (!content.trim() || isSubmitting) && styles.postButtonDisabled
            ]}
            onPress={handlePost}
            disabled={!content.trim() || isSubmitting}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </Pressable>
        </View>

        {/* Input Area */}
        <View style={styles.inputSection}>
          <Image 
            source={{ uri: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }} 
            style={[styles.avatar, { backgroundColor: colors.surface }]} 
          />
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary }]}
            placeholder="What's happening on campus...?"
            placeholderTextColor={colors.textTertiary}
            multiline
            autoFocus
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom Toolbar */}
        <View style={[styles.toolbar, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <View style={styles.toolbarIcons}>
            <Pressable style={styles.iconButton}>
              <ImageIcon color={colors.primary} size={22} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Video color={colors.primary} size={22} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <LinkIcon color={colors.primary} size={22} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Smile color={colors.primary} size={22} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <AlignLeft color={colors.primary} size={22} />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <MoreHorizontal color={colors.primary} size={22} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: defaultColors.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColors.textPrimary,
  },
  postButton: {
    backgroundColor: defaultColors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  inputSection: {
    flexDirection: 'row',
    padding: spacing.lg,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    backgroundColor: defaultColors.surface,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: defaultColors.textPrimary,
    minHeight: 150,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarIcons: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  iconButton: {
    padding: spacing.xs,
  },
  // Guest styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  guestButton: {
    backgroundColor: defaultColors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  guestButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
