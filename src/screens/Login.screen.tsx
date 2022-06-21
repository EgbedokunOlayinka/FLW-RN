// import { NavigationProp } from '@react-navigation/native';
import { FormikHelpers, useFormik } from 'formik';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppBtn from '../components/AppBtn';
import AppInput from '../components/AppInput';
import AppText from '../components/AppText';
import { useAppContext } from '../context/AppContext';
import { theme } from '../theme/theme';
import { loginSchema } from '../validation';
// import { StackParamList } from '../types/stack';

// type Props = {
//   navigation: NavigationProp<StackParamList, 'Login'>;
// };

interface IFormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const { loginUser } = useAppContext();

  const initialValues: IFormValues = {
    email: '',
    password: '',
  };

  const handleFormAction = async (
    values: IFormValues,
    actions: FormikHelpers<IFormValues>
  ) => {
    try {
      const res = await loginUser({
        email: values.email.toLowerCase(),
        password: values.password,
      });

      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: handleFormAction,
    });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <AppText
          style={styles.title}
          variant="bold"
          size={24}
          color={theme.colors.primary}
        >
          BLUEMOON SOLUTIONS
        </AppText>

        <AppText style={styles.sub} variant="bold" size={20}>
          Sign in
        </AppText>

        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <AppInput
              placeholder="test@mail.com"
              label="Email address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email && touched.email ? true : false}
              errorText={errors.email && touched.email ? errors.email : ''}
            />
          </View>
          <View style={styles.input}>
            <AppInput
              label="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password && touched.password ? true : false}
              errorText={
                errors.password && touched.password ? errors.password : ''
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.btnContainer}>
        <AppBtn onPress={handleSubmit}>Login</AppBtn>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginTop: 16,
  },
  sub: {
    textAlign: 'center',
    marginTop: 16,
  },
  inputContainer: {
    marginTop: 32,
  },
  input: {
    marginBottom: 16,
  },
  btnContainer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
});

export default LoginScreen;
