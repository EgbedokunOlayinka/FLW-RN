import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import capitalize from '../helpers/capitalize';
import { theme } from '../theme/theme';
import { IInventoryItem } from '../types';
import AppText from './AppText';

interface Props extends TouchableOpacityProps {
  item: IInventoryItem;
  clickAction: (item: IInventoryItem) => void;
}

const InventoryItem = ({ item, clickAction, ...props }: Props) => {
  const handleClick = useCallback(() => {
    clickAction(item);
  }, [item]);

  return (
    <TouchableOpacity {...props} style={styles.container} onPress={handleClick}>
      <View style={styles.topFlex}>
        <AppText>{capitalize(item.name)}</AppText>
        <AppText variant="bold">₦{item.price}</AppText>
      </View>
      <AppText color={theme.colors.textLight} size={12}>
        Total stock: {item.totalStock}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  topFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default InventoryItem;
