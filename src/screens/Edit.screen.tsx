import { NavigationProp, RouteProp } from '@react-navigation/native';
import { FormikHelpers, useFormik } from 'formik';
import { customAlphabet } from 'nanoid/non-secure';
import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppBtn from '../components/AppBtn';
import AppInput from '../components/AppInput';
import AppText from '../components/AppText';
import { useAppContext } from '../context/AppContext';
import { StackParamList } from '../types/stack';
import { createItemSchema } from '../validation';
import Toast from 'react-native-toast-message';
import { theme } from '../theme/theme';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

type Props = {
  navigation: NavigationProp<StackParamList, 'Edit'>;
  route: RouteProp<StackParamList, 'Edit'>;
};

interface IFormValues {
  name: string;
  totalStock: string;
  price: string;
  description: string;
}

const EditScreen = ({ navigation, route }: Props) => {
  const {
    name,
    price,
    description,
    totalStock,
    id,
    user: itemUser,
  } = route.params;

  const { user, editInventoryItem } = useAppContext();

  const initialValues: IFormValues = {
    name,
    totalStock: `${totalStock}`,
    price: `${price}`,
    description,
  };

  const handleFormAction = async (
    values: IFormValues,
    actions: FormikHelpers<IFormValues>
  ) => {
    try {
      await editInventoryItem({
        name: values.name.toLowerCase(),
        description: values.description.toLowerCase(),
        price: Number(values.price),
        totalStock: Number(values.totalStock),
        id,
        user: itemUser,
      });

      Toast.show({
        type: 'success',
        text1: 'Item edited successfully',
      });

      navigation.navigate('Home');

      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const navBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: createItemSchema,
      onSubmit: handleFormAction,
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backBtnView}>
        <TouchableOpacity style={styles.backBtn} onPress={navBack}>
          <AppText color="white" size={12}>
            Back
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.topBar}>
        <AppText variant="bold" size={20}>
          Edit inventory item
        </AppText>
      </View>

      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <View style={styles.input}>
          <AppInput
            placeholder="Bags"
            label="Item name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            error={errors.name && touched.name ? true : false}
            errorText={errors.name && touched.name ? errors.name : ''}
          />
        </View>
        <View style={styles.input}>
          <AppInput
            label="Total stock"
            placeholder="20"
            value={values.totalStock}
            onChangeText={handleChange('totalStock')}
            onBlur={handleBlur('totalStock')}
            error={errors.totalStock && touched.totalStock ? true : false}
            errorText={
              errors.totalStock && touched.totalStock ? errors.totalStock : ''
            }
            returnKeyType="done"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.input}>
          <AppInput
            label="Price(₦)"
            placeholder="2000"
            value={values.price}
            onChangeText={handleChange('price')}
            onBlur={handleBlur('price')}
            error={errors.price && touched.price ? true : false}
            errorText={errors.price && touched.price ? errors.price : ''}
            returnKeyType="done"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.input}>
          <AppInput
            placeholder="Brand new black bags"
            label="Item description"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            error={errors.description && touched.description ? true : false}
            errorText={
              errors.description && touched.description
                ? errors.description
                : ''
            }
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.btnContainer}>
        <AppBtn onPress={handleSubmit}>Edit item</AppBtn>
      </View>
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
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: 24,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 32,
  },
  input: {
    marginBottom: 16,
  },
  btnContainer: {
    marginTop: 'auto',
  },
  backBtnView: {
    position: 'absolute',
    top: 20,
    left: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
});

export default EditScreen;
