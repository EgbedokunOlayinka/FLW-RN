import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserKey,
  getCurrentUserFromStorage,
  getInventoryFromStorage,
  inventoryKey,
} from '../context/AppContext';
import testInventoryItem from './testInventoryItem';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('add item, remove item, and edit item', () => {
  test('add item to async storage inventory if item name is unique', async () => {
    await AsyncStorage.setItem(inventoryKey, JSON.stringify([]));

    const result = await getInventoryFromStorage();

    expect(result).toEqual([]);

    const itemFound = result?.find(
      (item) => item.name === testInventoryItem.name
    );

    expect(itemFound).toBeFalsy();

    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([result, itemFound])
    );
  });

  test('remove item from async storage when deleted by user', async () => {
    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([testInventoryItem])
    );

    const result = await getInventoryFromStorage();

    expect(result).toEqual([testInventoryItem]);

    const filtered = result?.filter((item) => item.id !== testInventoryItem.id);

    await AsyncStorage.setItem(inventoryKey, JSON.stringify(filtered));

    const lastRes = await getInventoryFromStorage();

    expect(lastRes).toEqual([]);
  });

  test('edit an existing inventory item in the async storage', async () => {
    const oldItem = {
      name: 'old bags',
      price: 10,
      totalStock: 15,
      description: 'good bags',
      user: 'test@mail.com',
      id: '123457',
    };

    const editedItem = {
      name: 'good bags',
      price: 10,
      totalStock: 15,
      description: 'good bags',
      user: 'test@mail.com',
      id: '123457',
    };

    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([testInventoryItem, oldItem])
    );

    const result = await getInventoryFromStorage();

    expect(result).toEqual([testInventoryItem, oldItem]);

    const itemFound = result?.find((item) => item.name === editedItem.name);

    expect(itemFound).toBeFalsy();

    const newRes = result?.map((item) =>
      item.id === editedItem.id ? editedItem : item
    );

    await AsyncStorage.setItem(inventoryKey, JSON.stringify(newRes));

    const lastRes = await getInventoryFromStorage();

    expect(lastRes).toEqual([testInventoryItem, editedItem]);
  });

  test('get the inventory for the user that is stored in the async storage', async () => {
    const testUser = { email: 'test@mail.com', password: '1234' };
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
