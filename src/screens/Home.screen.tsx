import { NavigationProp } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import InventoryItem from '../components/InventoryItem';
import { useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';
import { IInventoryItem } from '../types';
import { StackParamList } from '../types/stack';

type Props = {
  navigation: NavigationProp<StackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: Props) => {
  const { logoutUser, user, inventory } = useAppContext();

  const navToCreate = useCallback(() => {
    navigation.navigate('Create');
  }, []);

  const navToEdit = useCallback((item: IInventoryItem) => {
    navigation.navigate('Edit', item);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addBtnView}>
        <TouchableOpacity style={styles.addBtn} onPress={navToCreate}>
          <AppText color="white" size={30} style={styles.addBtnText}>
            +
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.topBar}>
        <AppText variant="bold" size={16}>
          {user?.email}
        </AppText>
        <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
          <AppText color="white" variant="bold">
            LOGOUT
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.middleBar}>
        <AppText variant="bold" size={20}>
          Your inventory
        </AppText>
        <AppText>
          {inventory.length} {inventory.length === 1 ? 'item' : 'items'}
        </AppText>
      </View>

      {inventory.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={inventory}
            renderItem={({ item }) => (
              <InventoryItem item={item} clickAction={navToEdit} />
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      ) : (
        <View style={styles.noItemsView}>
          <AppText style={styles.noItemsViewText} size={14}>
            You currently have no items in your inventory. Click the button at
            the bottom-right corner of the screen to add your first item!
          </AppText>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutBtn: {
    backgroundColor: theme.colors.secondaryRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  middleBar: {
    alignItems: 'center',
    marginTop: 16,
  },
  addBtnView: {
    position: 'absolute',
    borderRadius: 50,
    width: 50,
    height: 50,
    bottom: 50,
    right: 16,
    backgroundColor: theme.colors.primary,
    elevation: 1,
    zIndex: 2,
  },
  addBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  addBtnText: {
    marginTop: 4,
  },
  noItemsView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItemsViewText: {
    textAlign: 'center',
    width: '90%',
  },
  listContainer: {
    marginTop: 12,
    flex: 1,
  },
  list: {
    marginTop: 8,
  },
  separator: {
    marginBottom: 4,
    height: 1,
    backgroundColor: theme.colors.customGreyTwo,
  },
});

export default HomeScreen;
