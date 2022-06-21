import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IInventoryItem, IUser } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usersKey = 'my-app-users';
const currentUserKey = 'my-app-current-user';
const inventoryKey = 'my-app-inventory';

type AppContextType = {
  inventory: IInventoryItem[];
  user: IUser | null;
  loginUser: (val: IUser) => Promise<void>;
  logoutUser: () => void;
  addItemToInventory: (val: IInventoryItem) => Promise<void>;
  editInventoryItem: (val: IInventoryItem) => Promise<void>;
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

const AppContext = createContext<AppContextType>(defaultValue);

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
    []
  );

  const getCurrentUserFromStorage =
    useCallback(async (): Promise<IUser | null> => {
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
    }, []);

  const getUsersFromStorage = useCallback(async (): Promise<IUser[] | null> => {
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
  }, []);

  const getInventoryFromStorage = useCallback(async (): Promise<
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
  }, []);

  const loginUser = useCallback(
    async (val: IUser) => {
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
          Promise.reject('Incorrect email/password combination');
          return;
        }
      } catch (error) {
        // throw Error(error);
      }
    },
    [user]
  );

  const logoutUser = useCallback(async () => {
    await AsyncStorage.removeItem(currentUserKey);
    setUser(null);
    setInventory([]);
  }, [user, inventory]);

  const addItemToInventory = useCallback(
    async (val: IInventoryItem) => {
      const newInventory = [...inventory, val];
      await AsyncStorage.setItem(inventoryKey, JSON.stringify(newInventory));
      setInventory(newInventory);
    },
    [inventory]
  );

  const removeItemFromInventory = useCallback(
    async (val: string) => {
      // filter the item from the inventory by its ID
      const newInventory = [...inventory].filter((item) => item.id !== val);
      await AsyncStorage.setItem(inventoryKey, JSON.stringify(newInventory));
      setInventory(newInventory);
    },
    [inventory]
  );

  const editInventoryItem = useCallback(
    async (val: IInventoryItem) => {
      const newInventory = [...inventory].map((item) =>
        item.id === val.id ? val : item
      );
      await AsyncStorage.setItem(inventoryKey, JSON.stringify(newInventory));
      setInventory(newInventory);
    },
    [inventory]
  );

  const loadAppDataFromStorage = useCallback(async () => {
    try {
      const storedUsers = await getUsersFromStorage();
      const storedCurrentUser = await getCurrentUserFromStorage();
      const storedInventory = await getInventoryFromStorage();

      setUser(storedCurrentUser);

      if (storedInventory) {
        setInventory(
          !storedCurrentUser
            ? []
            : inventory.filter((item) => item.user === storedCurrentUser.email)
        );
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    loadAppDataFromStorage();
  }, []);

  // console.log({ user, inventory });

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
