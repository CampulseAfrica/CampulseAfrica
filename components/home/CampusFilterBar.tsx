import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

interface CampusFilterBarProps {
  campuses: string[];
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
}

export const CampusFilterBar: React.FC<CampusFilterBarProps> = ({
  campuses,
  selectedCampus,
  onSelectCampus,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {campuses.map((campus) => {
          const isSelected = selectedCampus === campus;
          return (
            <Pressable
              key={campus}
              onPress={() => onSelectCampus(campus)}
              style={[
                styles.pill,
                isSelected
                  ? [
                      styles.activePill,
                      {
                        backgroundColor: isDark ? colors.primary : '#111827',
                        borderColor: isDark ? colors.primary : '#111827',
                      },
                    ]
                  : [
                      styles.inactivePill,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ],
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isDark
                      ? colors.textPrimary
                      : '#374151',
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {campus}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {},
  inactivePill: {},
  pillText: {
    fontSize: 13,
  },
});
