import { NavigationProp, RouteProp } from '@react-navigation/native';
import { FormikHelpers, useFormik } from 'formik';
import React, { useCallback } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
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
  const { name, price, description, totalStock, id, user } = route.params;

  const { editInventoryItem, removeItemFromInventory } = useAppContext();

  const initialValues: IFormValues = {
    name,
    totalStock: `${totalStock}`,
    price: `${price}`,
    description,
  };

  const handleFormAction = useCallback(
    async (values: IFormValues, actions: FormikHelpers<IFormValues>) => {
      try {
        const res = await editInventoryItem({
          name: values.name.toLowerCase(),
          description: values.description.toLowerCase(),
          price: Number(values.price),
          totalStock: Number(values.totalStock),
          id,
          user,
        });

        if (res) {
          Toast.show({
            type: 'error',
            text1: res,
          });
        } else {
          Toast.show({
            text1: 'Item edited successfully',
          });

          navigation.navigate('Home');

          actions.resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const confirmDelete = useCallback(
    () =>
      Alert.alert('Delete item', 'You are about to delete this item', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Confirm', onPress: handleDelete },
      ]),
    []
  );

  const handleDelete = useCallback(async () => {
    await removeItemFromInventory(id);

    Toast.show({
      text1: 'Item deleted successfully',
    });

    navigation.navigate('Home');
  }, []);

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
      <View style={styles.containerView}>
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
              multiline
              style={styles.textArea}
              returnKeyType="done"
            />
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.btnContainer}>
          <AppBtn onPress={handleSubmit}>Edit item</AppBtn>
          <AppBtn
            onPress={confirmDelete}
            style={styles.deleteBtn}
            testID="EditScreen.DeleteButton"
          >
            Delete item
          </AppBtn>
        </View>
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
  containerView: {
    flex: 1,
    padding: 16,
    position: 'relative',
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
    zIndex: 1,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  deleteBtn: {
    backgroundColor: theme.colors.secondaryRed,
    marginTop: 12,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
});

export default EditScreen;
