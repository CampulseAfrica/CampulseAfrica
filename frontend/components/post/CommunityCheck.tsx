import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme';
import { VoteType } from '../../types';
import { TrueIcon, MisleadingIcon, FalseIcon } from '../ui/Icons';

interface CommunityCheckProps {
  trueCount: number;
  misleadingCount: number;
  falseCount: number;
  userVote: VoteType | null;
  onVote: (type: VoteType) => void;
  isOwnPost?: boolean;
}

export const CommunityCheck: React.FC<CommunityCheckProps> = memo(({
  trueCount,
  misleadingCount,
  falseCount,
  userVote,
  onVote,
  isOwnPost = false,
}) => {
  const { colors, isDark } = useTheme();
  const totalVotes = trueCount + misleadingCount + falseCount;

  const voteOptions = [
    {
      type: 'true' as const,
      label: 'True',
      Icon: TrueIcon,
      count: trueCount,
      activeColor: colors.voteTrue,
      borderLight: '#86EFAC',
      borderDark: 'rgba(34, 197, 94, 0.4)',
      bgLight: colors.voteTrueBg,
      bgActiveLight: '#DCFCE7',
      bgDark: 'rgba(34, 197, 94, 0.1)',
      bgActiveDark: 'rgba(34, 197, 94, 0.22)',
    },
    {
      type: 'misleading' as const,
      label: 'Misleading',
      Icon: MisleadingIcon,
      count: misleadingCount,
      activeColor: colors.voteMisleading,
      borderLight: '#FDE68A',
      borderDark: 'rgba(245, 158, 11, 0.4)',
      bgLight: colors.voteMisleadingBg,
      bgActiveLight: '#FEF3C7',
      bgDark: 'rgba(245, 158, 11, 0.1)',
      bgActiveDark: 'rgba(245, 158, 11, 0.22)',
    },
    {
      type: 'false' as const,
      label: 'False',
      Icon: FalseIcon,
      count: falseCount,
      activeColor: colors.voteFalse,
      borderLight: '#FECACA',
      borderDark: 'rgba(239, 68, 68, 0.4)',
      bgLight: colors.voteFalseBg,
      bgActiveLight: '#FEE2E2',
      bgDark: 'rgba(239, 68, 68, 0.1)',
      bgActiveDark: 'rgba(239, 68, 68, 0.22)',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header: Label + Total Votes */}
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Community check
        </Text>
        <Text style={[styles.voteCountText, { color: colors.textSecondary }]}>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </Text>
      </View>

      {isOwnPost ? (
        /* Flat View-Only Breakdown for Author's Own Post (Non-interactive) */
        <View style={styles.flatRow}>
          {/* True */}
          <View style={styles.flatMetric}>
            <TrueIcon width={22} height={22} color={colors.voteTrue} />
            <View style={styles.flatMetricText}>
              <Text style={[styles.flatLabel, { color: colors.textSecondary }]}>
                True
              </Text>
              <Text style={[styles.flatValue, { color: colors.textPrimary }]}>
                {trueCount}
              </Text>
            </View>
          </View>

          {/* Misleading */}
          <View style={styles.flatMetric}>
            <MisleadingIcon width={22} height={22} color={colors.voteMisleading} />
            <View style={styles.flatMetricText}>
              <Text style={[styles.flatLabel, { color: colors.textSecondary }]}>
                Misleading
              </Text>
              <Text style={[styles.flatValue, { color: colors.textPrimary }]}>
                {misleadingCount}
              </Text>
            </View>
          </View>

          {/* False */}
          <View style={styles.flatMetric}>
            <FalseIcon width={22} height={22} color={colors.voteFalse} />
            <View style={styles.flatMetricText}>
              <Text style={[styles.flatLabel, { color: colors.textSecondary }]}>
                False
              </Text>
              <Text style={[styles.flatValue, { color: colors.textPrimary }]}>
                {falseCount}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        /* Interactive Tactile Buttons for Other Users' Posts (Voting Enabled) */
        <View style={styles.cardsRow}>
          {voteOptions.map((option) => {
            const isSelected = userVote === option.type;
            const borderColor = isSelected
              ? option.activeColor
              : isDark
                ? option.borderDark
                : option.borderLight;
            const backgroundColor = isDark
              ? isSelected
                ? option.bgActiveDark
                : option.bgDark
              : isSelected
                ? option.bgActiveLight
                : option.bgLight;

            return (
              <Pressable
                key={option.type}
                onPress={() => onVote(option.type)}
                style={({ pressed }) => [
                  styles.voteCard,
                  {
                    backgroundColor,
                    borderColor,
                    borderWidth: isSelected ? 2 : 1.5,
                  },
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <option.Icon width={16} height={16} color={option.activeColor} />
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: isDark ? colors.textPrimary : '#1F2937' },
                    ]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <Text style={[styles.countValue, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                    {option.count}
                  </Text>

                  {/* Interactive Button Selection Indicator */}
                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected
                        ? [
                            styles.indicatorSelected,
                            {
                              backgroundColor: option.activeColor,
                              borderColor: option.activeColor,
                            },
                          ]
                        : [
                            styles.indicatorUnselected,
                            {
                              borderColor: isDark
                                ? 'rgba(255, 255, 255, 0.35)'
                                : 'rgba(0, 0, 0, 0.22)',
                            },
                          ],
                    ]}
                  >
                    {isSelected && (
                      <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                        <Path
                          d="M2 5L4.2 7.2L8 2.8"
                          stroke="#FFFFFF"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  voteCountText: {
    fontSize: 13,
    fontWeight: '500',
  },
  /* Flat read-only layout (own post) */
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  flatMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flatMetricText: {
    flexDirection: 'column',
  },
  flatLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  flatValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  /* Interactive tactile button layout (other users' posts) */
  cardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voteCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 2.5,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  countValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  selectionIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorUnselected: {
    backgroundColor: 'transparent',
  },
  indicatorSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
});
