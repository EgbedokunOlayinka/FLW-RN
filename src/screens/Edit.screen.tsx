import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { StackParamList } from '../types/stack';

type Props = {
  navigation: NavigationProp<StackParamList, 'Edit'>;
};

const EditScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Edit screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditScreen;
