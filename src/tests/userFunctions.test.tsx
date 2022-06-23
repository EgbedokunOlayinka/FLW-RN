import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserKey,
  getCurrentUserFromStorage,
  getInventoryFromStorage,
  getUsersFromStorage,
  inventoryKey,
  usersKey,
} from '../context/AppContext';
import testUser from '../testData/testUser';
import testInventoryItem from '../testData/testInventoryItem';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('getUsersFromStorage function', () => {
  it('should return an array of users if the usersKey key is present in the async storage', async () => {
    await AsyncStorage.setItem(usersKey, JSON.stringify([testUser]));

    const result = await getUsersFromStorage();

    expect(result).toEqual([testUser]);
  });

  it('should return null if the usersKey key is not present in the async storage', async () => {
    const result = await getUsersFromStorage();

    expect(result).toBeNull();
  });
});

describe('getCurrentUserFromStorage function', () => {
  it('should return a user object if the currentUserKey key is present in the async storage', async () => {
    await AsyncStorage.setItem(currentUserKey, JSON.stringify(testUser));

    const result = await getCurrentUserFromStorage();

    expect(result).toEqual(testUser);
  });

  it('should return null if the currentUserKey key is not present in the async storage', async () => {
    const result = await getCurrentUserFromStorage();

    expect(result).toBeNull();
  });
});

describe('loginUser function', () => {
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

    await AsyncStorage.setItem(usersKey, JSON.stringify([oldUser, newUser]));

    const newResult = await getUsersFromStorage();

    expect(newResult).toEqual([oldUser, newUser]);
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

describe('handleSetUser function', () => {
  test('store current user data in async storage and also correctly get the items that the user has added to the inventory in the async storage', async () => {
    await AsyncStorage.setItem(currentUserKey, JSON.stringify(testUser));
    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([testInventoryItem])
    );

    const result = await getCurrentUserFromStorage();

    expect(result).toEqual(testUser);

    const generalInventory = await getInventoryFromStorage();

    expect(generalInventory).toEqual([testInventoryItem]);

    const userInventory = generalInventory?.filter(
      (item) => item.user === testUser.email
    );

    expect(userInventory).toEqual([testInventoryItem]);
  });

  test('remove current user data from async storage', async () => {
    await AsyncStorage.removeItem(currentUserKey);

    const result = await getCurrentUserFromStorage();

    expect(result).toBeNull();
  });
});

describe('loadAppDataFromStorage function', () => {
  test('get the stored user and the inventory for the user that is stored in the async storage', async () => {
    await AsyncStorage.setItem(currentUserKey, JSON.stringify(testUser));
    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([testInventoryItem])
    );

    const inventoryRes = await getInventoryFromStorage();
    const userRes = await getCurrentUserFromStorage();

    expect(inventoryRes).toEqual([testInventoryItem]);
    expect(userRes).toEqual(testUser);

    const userInventory = inventoryRes?.filter(
      (item) => item.user === userRes?.email
    );

    expect(userInventory).toEqual([testInventoryItem]);
  });
});
