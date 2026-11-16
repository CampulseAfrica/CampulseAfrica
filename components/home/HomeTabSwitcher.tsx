import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { FeedTab } from '../../types';

interface HomeTabSwitcherProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

export const HomeTabSwitcher: React.FC<HomeTabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceElevated : '#EBECEF',
        },
      ]}
    >
      <Pressable
        style={[
          styles.tab,
          activeTab === 'mySchool' && [
            styles.activeTab,
            {
              backgroundColor: colors.surface,
              shadowColor: isDark ? '#000000' : '#000000',
            },
          ],
        ]}
        onPress={() => onTabChange('mySchool')}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'mySchool' ? colors.primary : colors.textSecondary,
              fontWeight: activeTab === 'mySchool' ? '700' : '500',
            },
          ]}
        >
          My school
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          activeTab === 'otherCampus' && [
            styles.activeTab,
            {
              backgroundColor: colors.surface,
              shadowColor: isDark ? '#000000' : '#000000',
            },
          ],
        ]}
        onPress={() => onTabChange('otherCampus')}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'otherCampus' ? colors.primary : colors.textSecondary,
              fontWeight: activeTab === 'otherCampus' ? '700' : '500',
            },
          ]}
        >
          Other campuses
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeTab: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
});
