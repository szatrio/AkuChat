/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'react-native-gesture-handler'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Image } from 'react-native'
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
// import { FlexibleTabBarComponent, withCustomStyle } from 'react-navigation-custom-bottom-tab-component/FlexibleTabBarComponent'

import LoginScreen from './src/screens/loginScreen'
import HomeScreen from './src/screens/homeScreen'
import AuthLoadingScreen from './src/screens/authLoadingScreen'
import ChatScreen from './src/screens/chatScreen'
import ProfileScreen from './src/screens/profileScreen'

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
});

AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index > 0 ? false : true

  return {
    tabBarVisible
  }
}

const AuthStack = createStackNavigator({ Login: LoginScreen });

const TabNavigator = createBottomTabNavigator({
  Chats: AppStack,
  // Locations: ProfileScreen,
  Profile: ProfileScreen,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let imageName = require('./assets/img/speak.png');
      if (routeName === 'Profile') {
        imageName = require('./assets/img/user.png')
      }

      // You can return any component that you like here!
      return <Image source={imageName} style={{width:25, resizeMode: 'contain'}} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
}
)

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);