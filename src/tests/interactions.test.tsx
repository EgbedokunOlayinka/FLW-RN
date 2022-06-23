import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import EditScreen from '../screens/Edit.screen';
import { Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import HomeScreen from '../screens/Home.screen';

const mockedNavigate = jest.fn();
const mockedPush = jest.fn();
const mockedParams = jest.mock('../testData/testInventoryItem');

const mockedNavigation = { navigate: mockedNavigate, push: mockedPush };
const mockedRoute = { params: mockedParams };

jest.spyOn(Alert, 'alert');

// test that confirmation popup shows up when the delete item button is pressed
describe('Pressing delete button', () => {
  it('shows confirmation popup alert', () => {
    // get the edit screen
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
    expect(Alert.alert).toHaveBeenCalled();
  });
});

describe('Tapping inventory item', () => {
  it('navigates to the edit page showing the details of that item', () => {
    // mock the initial state of the context to provide an existing item in the inventory
    const component = (
      <AppContext.Provider
        value={{
          user: {
            email: 'test',
            password: 'test',
          },
          inventory: [
            {
              name: 'test inventory item name',
              price: 10,
              totalStock: 15,
              description: 'good books',
              user: 'test@mail.com',
              id: '12345667',
            },
          ],
          loginUser: async () => {},
          logoutUser: () => {},
          addItemToInventory: async () => {},
          editInventoryItem: async () => {},
          removeItemFromInventory: async () => {},
        }}
      >
        <AppContext.Consumer>
          {(value) => <HomeScreen navigation={mockedNavigation as any} />}
        </AppContext.Consumer>
      </AppContext.Provider>
    );

    const { getByTestId } = render(component);

    const testItem = getByTestId('inventory item');

    // get the test inventory item from the home screen
    expect(testItem).toBeDefined();

    // fire the press event on the item
    fireEvent.press(testItem);

    // confirm that the navigate function pushed to the Edit screen with the correct item as its params
    expect(mockedNavigate).toBeCalledWith('Edit', {
      description: 'good books',
      id: '12345667',
      name: 'test inventory item name',
      price: 10,
      totalStock: 15,
      user: 'test@mail.com',
    });
  });
});
