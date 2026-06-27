import React, { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme';
import { HomeIcon, DiscoverIcon, NotificationIcon, CreateIcon } from '../../components/ui/TabIcons';
import { User } from 'lucide-react-native';

interface TabIconProps {
  icon: ReactNode;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabIconContainer}>
      {icon}
      <Text numberOfLines={1} style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarButton: (props) => (
          <Pressable
            {...(props as any)}
            style={({ pressed }) => [
              props.style,
              pressed && { opacity: 0.7 }, // Clean iOS-style fade instead of a black shadow
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
              icon={<HomeIcon color={color as string} size={focused ? 26 : 22} />}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<DiscoverIcon color={color as string} size={focused ? 26 : 22} />}
              label="Discover"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => (
            <View style={styles.createButtonContainer}>
              <CreateIcon size={72} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<NotificationIcon color={color as string} size={focused ? 26 : 22} />}
              label="Notification"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              icon={<User color={color as string} size={focused ? 26 : 22} strokeWidth={focused ? 2.5 : 2} />}
              label="Profile"
              focused={focused}
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
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    height: 72,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 60,
  },
  createButtonContainer: {
    top: -29, // adjusted
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.tabBarInactive,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#4B3EDC', // Extracted exactly from the Figma active state
    fontWeight: '600',
  },
});
