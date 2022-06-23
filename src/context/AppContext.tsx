import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IInventoryItem, IUser } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usersKey = 'my-app-users';
export const currentUserKey = 'my-app-current-user';
export const inventoryKey = 'my-app-inventory';

export type AppContextType = {
  inventory: IInventoryItem[];
  user: IUser | null;
  loginUser: (val: IUser) => Promise<void | string>;
  logoutUser: () => void;
  addItemToInventory: (val: IInventoryItem) => Promise<void | string>;
  editInventoryItem: (val: IInventoryItem) => Promise<void | string>;
  removeItemFromInventory: (val: string) => Promise<void>;
};

const defaultValue = {
  inventory: [],
  user: null,
  loginUser: async () => {},
  logoutUser: () => {},
  addItemToInventory: async () => {},
  editInventoryItem: async () => {},
  removeItemFromInventory: async () => {},
};

export const getCurrentUserFromStorage = async (): Promise<IUser | null> => {
  try {
    const data = await AsyncStorage.getItem(currentUserKey);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getUsersFromStorage = async (): Promise<IUser[] | null> => {
  try {
    const data = await AsyncStorage.getItem(usersKey);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getInventoryFromStorage = async (): Promise<
  IInventoryItem[] | null
> => {
  try {
    const data = await AsyncStorage.getItem(inventoryKey);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const AppContext = createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC = ({ children }) => {
  const [inventory, setInventory] = useState<IInventoryItem[]>([]);
  const [user, setUser] = useState<IUser | null>(null);

  const handleSetUser = useCallback(
    async (val: IUser | null): Promise<void> => {
      try {
        if (!val) {
          await AsyncStorage.removeItem(currentUserKey);
        } else {
          await AsyncStorage.setItem(currentUserKey, JSON.stringify(val));
        }

        setUser(val);

        const storedInventory = await getInventoryFromStorage();
        if (storedInventory) {
          setInventory(
            storedInventory.filter((item) => item.user === val?.email)
          );
        }
      } catch (error) {}
    },
    [user, inventory]
  );

  const loginUser = useCallback(
    async (val: IUser): Promise<string | void> => {
      try {
        // get users array from local storage
        const users = await getUsersFromStorage();
        let newUsersArr = [];

        // if it does not exist yet, create it and add the new user to it
        if (!users) {
          newUsersArr = [val];
          await AsyncStorage.setItem(usersKey, JSON.stringify(newUsersArr));
          handleSetUser(val);
          return;
        }

        const userFound = users.find((user) => user.email === val.email);

        // if it is not an existing user, add the user to the users array
        if (!userFound) {
          newUsersArr = [...users, val];
          await AsyncStorage.setItem(usersKey, JSON.stringify(newUsersArr));
          handleSetUser(val);
          return;
        }

        // if password is not correct, throw error
        if (userFound.password === val.password) {
          handleSetUser(val);
        } else {
          // Promise.reject('Incorrect email/password combination');
          return 'Incorrect email/password combination';
        }
      } catch (error) {
        // throw Error(error);
      }
    },
    [user, inventory]
  );

  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(currentUserKey);

      setUser(null);
      setInventory([]);
    } catch (error) {}
  }, [user, inventory]);

  const addItemToInventory = useCallback(
    async (val: IInventoryItem): Promise<string | void> => {
      try {
        // check if an item with the same name exists already
        const itemFound = inventory.find((item) => item.name === val.name);
        if (itemFound) {
          return 'An item with the same name exists already';
        }

        const newInventory = [...inventory, val];
        const oldInventory = await getInventoryFromStorage();

        const mergedInventory = oldInventory
          ? [...oldInventory, val]
          : newInventory;

        await AsyncStorage.setItem(
          inventoryKey,
          JSON.stringify(mergedInventory)
        );

        setInventory(newInventory);
      } catch (error) {}
    },
    [inventory]
  );

  const removeItemFromInventory = useCallback(
    async (val: string) => {
      try {
        // filter the item from the inventory by its ID
        const newInventory = [...inventory].filter((item) => item.id !== val);
        const oldInventory = await getInventoryFromStorage();

        const mergedInventory = oldInventory
          ? [...oldInventory].filter((item) => item.id !== val)
          : newInventory;

        await AsyncStorage.setItem(
          inventoryKey,
          JSON.stringify(mergedInventory)
        );

        setInventory(newInventory);
      } catch (error) {}
    },
    [inventory]
  );

  const editInventoryItem = useCallback(
    async (val: IInventoryItem): Promise<string | void> => {
      try {
        // check if an item with the same name exists already
        const itemFound = inventory.find((item) => item.name === val.name);
        if (itemFound) {
          return 'An item with the same name exists already';
        }

        const newInventory = [...inventory].map((item) =>
          item.id === val.id ? val : item
        );
        const oldInventory = await getInventoryFromStorage();

        const mergedInventory = oldInventory
          ? [...oldInventory, val]
          : newInventory;

        await AsyncStorage.setItem(
          inventoryKey,
          JSON.stringify(mergedInventory)
        );
        setInventory(newInventory);
      } catch (error) {}
    },
    [inventory]
  );

  const loadAppDataFromStorage = useCallback(async () => {
    try {
      const storedCurrentUser = await getCurrentUserFromStorage();
      const storedInventory = await getInventoryFromStorage();

      setUser(storedCurrentUser);

      if (storedInventory) {
        setInventory(
          storedInventory?.filter(
            (item) => item.user === storedCurrentUser?.email
          )
        );
      } else {
        setInventory([]);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    loadAppDataFromStorage();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        inventory,
        loginUser,
        logoutUser,
        addItemToInventory,
        editInventoryItem,
        removeItemFromInventory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
