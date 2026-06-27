import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create New Post</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
