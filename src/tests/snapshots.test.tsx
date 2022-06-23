import React from 'react';
import renderer from 'react-test-renderer';
import CreateScreen from '../screens/Create.screen';
import EditScreen from '../screens/Edit.screen';
import HomeScreen from '../screens/Home.screen';
import LoginScreen from '../screens/Login.screen';

const mockedNavigate = jest.fn();
const mockedPush = jest.fn();
const mockedParams = jest.mock('./testInventoryItem');

const mockedNavigation = { navigate: mockedNavigate, push: mockedPush };
const mockedRoute = { params: mockedParams };

describe('Screens should render correctly', () => {
  test('home screen renders correctly', () => {
    const tree = renderer
      .create(<HomeScreen navigation={mockedNavigation as any} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('login screen renders correctly', () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('edit screen renders correctly', () => {
    const tree = renderer
      .create(
        <EditScreen
          navigation={mockedNavigation as any}
          route={mockedRoute as any}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('create screen renders correctly', () => {
    const tree = renderer
      .create(<CreateScreen navigation={mockedNavigation as any} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
