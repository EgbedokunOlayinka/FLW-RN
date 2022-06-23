import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserKey,
  getCurrentUserFromStorage,
} from '../context/AppContext';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('set and remove current user from async storage', () => {
  test('store current user data in async storage', async () => {
    const user = { email: 'new@mail.com', password: '1234' };

    await AsyncStorage.setItem(currentUserKey, JSON.stringify(user));

    const result = await getCurrentUserFromStorage();

    expect(result).toEqual(user);
  });

  test('remove current user data from async storage', async () => {
    await AsyncStorage.removeItem(currentUserKey);

    const result = await getCurrentUserFromStorage();

    expect(result).toBeNull();
  });
});
