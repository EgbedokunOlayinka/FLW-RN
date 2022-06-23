import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserKey,
  getCurrentUserFromStorage,
  getUsersFromStorage,
  usersKey,
} from '../context/AppContext';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('login user', () => {
  test('if no result exists for the users array key in async storage, return null', async () => {
    const result = await getUsersFromStorage();
    expect(result).toBeNull();
  });

  test('if a result exists for the users array in async storage, ensure the result is not null and returns an array', async () => {
    await AsyncStorage.setItem(
      usersKey,
      JSON.stringify([{ email: 'test@mail.com', password: '1234' }])
    );
    const result = await getUsersFromStorage();
    expect(result).not.toBeNull();
    expect(result).toEqual([{ email: 'test@mail.com', password: '1234' }]);
  });

  test('if the new user has a unique email, add the user to the users array in the async storage', async () => {
    const newUser = { email: 'new@mail.com', password: '1234' };
    const oldUser = { email: 'old@mail.com', password: '1234' };

    await AsyncStorage.setItem(usersKey, JSON.stringify([oldUser]));

    const result = await getUsersFromStorage();
    expect(result).toEqual([oldUser]);

    const userFound = result?.find((user) => user.email === newUser.email);

    expect(userFound).toBeFalsy();

    await AsyncStorage.setItem(usersKey, JSON.stringify([result, newUser]));

    const newResult = await getUsersFromStorage();

    expect(newResult).toEqual([result, newUser]);
  });

  test('if the user is an existing user with his email already in the users array of the async storage, check the entered password against his stored password', async () => {
    const existingUser = { email: 'new@mail.com', password: '1234' };

    await AsyncStorage.setItem(usersKey, JSON.stringify([existingUser]));

    const result = await getUsersFromStorage();
    expect(result).toEqual([existingUser]);

    const userFound = result?.find((user) => user.email === existingUser.email);

    expect(userFound).toBeTruthy();
    expect(userFound?.password).toEqual(existingUser.password);
  });
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
