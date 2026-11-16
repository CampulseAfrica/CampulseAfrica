import React, { memo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { useTheme } from '../../theme';
import { SendAirplaneIcon, CloseSmallIcon } from '../ui/Icons';
import { Comment } from '../../types';

interface CommentInputBarProps {
  userAvatar?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  replyingTo: Comment | null;
  onCancelReply: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  disabled?: boolean;
}

export const CommentInputBar: React.FC<CommentInputBarProps> = memo(({
  userAvatar,
  value,
  onChangeText,
  onSubmit,
  replyingTo,
  onCancelReply,
  inputRef,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
        },
      ]}
    >
      {/* Replying Banner */}
      {replyingTo && (
        <View
          style={[
            styles.replyBanner,
            {
              backgroundColor: isDark ? colors.surfaceElevated : '#F4F5F7',
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.replyBannerText, { color: colors.textSecondary }]}>
            Replying to{' '}
            <Text style={[styles.replyTargetName, { color: colors.primary }]}>
              {replyingTo.user.fullName}
            </Text>
          </Text>
          <Pressable
            onPress={onCancelReply}
            hitSlop={8}
            style={({ pressed }) => [styles.cancelReplyButton, pressed && styles.pressed]}
          >
            <CloseSmallIcon width={16} height={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      )}

      {/* Main Input Row */}
      <View style={styles.inputRow}>
        {/* Current User Avatar */}
        {userAvatar ? (
          <Image
            source={{ uri: userAvatar }}
            style={[styles.userAvatar, { backgroundColor: colors.surfaceElevated }]}
          />
        ) : (
          <View style={[styles.userAvatar, { backgroundColor: colors.surfaceElevated }]} />
        )}

        {/* Input Field (Rounded Pill) */}
        <View
          style={[
            styles.inputFieldContainer,
            {
              backgroundColor: isDark ? colors.surfaceElevated : '#F3F4F6',
            },
          ]}
        >
          <TextInput
            ref={inputRef as any}
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
            placeholderTextColor={colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            multiline
            editable={!disabled}
          />
        </View>

        {/* Circular Send Button */}
        <Pressable
          onPress={onSubmit}
          disabled={!value.trim() || disabled}
          style={({ pressed }) => [
            styles.sendButton,
            { backgroundColor: colors.primary },
            (!value.trim() || disabled) && styles.sendButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <SendAirplaneIcon width={18} height={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  replyBannerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  replyTargetName: {
    fontWeight: '700',
  },
  cancelReplyButton: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  inputFieldContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
