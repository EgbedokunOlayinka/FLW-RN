import React, { useMemo } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import capitalize from '../helpers/capitalize';
import { theme } from '../theme/theme';
import AppText from './AppText';

type Props = TextInputProps & {
  label?: string;
  error?: boolean;
  errorText?: string;
};

const AppInput = ({ style, label, error, errorText, ...props }: Props) => {
  const borderColor = useMemo(() => {
    if (error) {
      return { borderColor: theme.colors.error };
    } else {
      return { borderColor: theme.colors.primaryLight };
    }
  }, [error]);

  return (
    <View>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <TextInput
        style={[styles.input, borderColor, style]}
        {...props}
        placeholderTextColor={'silver'}
      />
      {errorText ? (
        <AppText color={theme.colors.error} size={12} style={styles.errorText}>
          {capitalize(errorText)}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontFamily: theme.fonts.regular,
  },
  label: {
    marginBottom: 6,
  },
  errorText: {
    marginTop: 4,
  },
});

export default AppInput;
