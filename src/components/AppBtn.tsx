import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme/theme';
import AppText from './AppText';

// type Props = {};

const AppBtn = ({ children, style, ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props} style={[styles.btn, style]}>
      <AppText color="white" variant="bold" size={18}>
        {children}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppBtn;
