import React, { useMemo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { theme } from '../theme/theme';

type Props = TextProps & {
  variant?: 'bold' | 'regular';
  color?: string;
  size?: number;
};

const AppText: React.FC<Props> = ({
  children,
  variant = 'regular',
  color = 'black',
  size = 14,
  style,
  ...props
}) => {
  const fontWeight = useMemo(() => {
    if (variant === 'bold') {
      return { fontFamily: theme.fonts.bold };
    } else {
      return { fontFamily: theme.fonts.regular };
    }
  }, [variant]);

  const fontColor = useMemo(() => {
    return { color };
  }, [color]);

  const fontSize = useMemo(() => {
    return { fontSize: size };
  }, [size]);

  return (
    <Text
      {...props}
      style={[styles.text, fontWeight, fontColor, fontSize, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});

export default AppText;
