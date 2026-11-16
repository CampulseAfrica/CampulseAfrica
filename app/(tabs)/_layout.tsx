import React, { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { HomeIcon, DiscoverIcon, NotificationIcon, CreateIcon } from '../../components/ui/TabIcons';
import { User } from 'lucide-react-native';

interface TabIconProps {
  icon: ReactNode;
  label: string;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
}

function TabIcon({ icon, label, focused, activeColor, inactiveColor }: TabIconProps) {
  return (
    <View style={styles.tabIconContainer}>
      {icon}
      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          { color: focused ? activeColor : inactiveColor },
          focused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: themeColors.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: isDark ? themeColors.border : '#E5E7EB',
          },
        ],
        tabBarShowLabel: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.tabBarInactive,
        tabBarButton: (props) => (
          <Pressable
            {...(props as any)}
            style={({ pressed }) => [
              props.style,
              pressed && { opacity: 0.75 },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<HomeIcon color={color as string} size={22} />}
              label="Home"
              focused={focused}
              activeColor={themeColors.primary}
              inactiveColor={themeColors.tabBarInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<DiscoverIcon color={color as string} size={22} />}
              label="Discover"
              focused={focused}
              activeColor={themeColors.primary}
              inactiveColor={themeColors.tabBarInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => (
            <View style={styles.createButtonContainer}>
              <CreateIcon size={46} bgColor={themeColors.primary} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<NotificationIcon color={color as string} size={22} />}
              label="Alerts"
              focused={focused}
              activeColor={themeColors.primary}
              inactiveColor={themeColors.tabBarInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<User color={color as string} size={22} strokeWidth={focused ? 2.5 : 2} />}
              label="Profile"
              focused={focused}
              activeColor={themeColors.primary}
              inactiveColor={themeColors.tabBarInactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    height: 66,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 60,
  },
  createButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
