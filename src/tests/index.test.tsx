import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import EditScreen from '../screens/Edit.screen';
import LoginScreen from '../screens/Login.screen';
import { useRoute } from '@react-navigation/native';
import { StackParamList } from '../types/stack';
import testInventoryItem from './testInventoryItem';
import { Alert } from 'react-native';

const mockedNavigate = jest.fn();
const mockedPush = jest.fn();
const mockedParams = jest.mock('./testInventoryItem');

const mockedNavigation = { navigate: mockedNavigate, push: mockedPush };
const mockedRoute = { params: mockedParams };

jest.spyOn(Alert, 'alert');

// test that confirmation popup shows up when the delete item button is pressed
describe('Pressing delete button', () => {
  it('shows confirmation popup for user to cancel or confirm delete', () => {
    const { getByTestId } = render(
      <EditScreen
        navigation={mockedNavigation as any}
        route={mockedRoute as any}
      />
    );
    // ensure the button exists
    expect(getByTestId('EditScreen.DeleteButton')).not.toBeNull();
    // fire the button press event
    fireEvent.press(getByTestId('EditScreen.DeleteButton'));
    // ensure that the alert shows up after the button is pressed
    expect(Alert.alert).toHaveTextContent('Delete item');
  });
});

// test that navigation pushes to the edit screen after user taps on an existing item in the inventory from the home screen

// crud tests
