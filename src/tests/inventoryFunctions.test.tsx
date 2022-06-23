import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  currentUserKey,
  getCurrentUserFromStorage,
  getInventoryFromStorage,
  inventoryKey,
} from '../context/AppContext';
import testInventoryItem from '../testData/testInventoryItem';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('getInventoryFromStorage function', () => {
  it('should return an array of inventory items if the inventoryKey key is present in the async storage', async () => {
    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([testInventoryItem])
    );

    const result = await getInventoryFromStorage();

    expect(result).toEqual([testInventoryItem]);
  });

  it('should return null if the inventoryKey key is not present in the async storage', async () => {
    const result = await getInventoryFromStorage();

    expect(result).toBeNull();
  });
});

describe('addItemToInventory function', () => {
  test('add item to async storage inventory if item name is unique', async () => {
    await AsyncStorage.setItem(inventoryKey, JSON.stringify([]));

    const result = await getInventoryFromStorage();

    expect(result).toEqual([]);

    // item name should be unique
    const itemFound = result?.find(
      (item) => item.name === testInventoryItem.name
    );

    expect(itemFound).toBeFalsy();

    await AsyncStorage.setItem(
      inventoryKey,
      JSON.stringify([result, itemFound])
    );
  });
});

describe('removeItemFromInventory function', () => {
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
});

describe('editInventoryItem function', () => {
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

    // item name should be unique
    const itemFound = result?.find((item) => item.name === editedItem.name);

    expect(itemFound).toBeFalsy();

    // carry out the actual edit
    const newRes = result?.map((item) =>
      item.id === editedItem.id ? editedItem : item
    );

    await AsyncStorage.setItem(inventoryKey, JSON.stringify(newRes));

    const lastRes = await getInventoryFromStorage();

    expect(lastRes).toEqual([testInventoryItem, editedItem]);
  });
});
