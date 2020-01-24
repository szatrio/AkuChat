/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'react-native-gesture-handler';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from './src/screens/loginScreen'
import HomeScreen from './src/screens/homeScreen'
import AuthLoadingScreen from './src/screens/authLoadingScreen'
import ChatScreen from './src/screens/chatScreen'
import ProfileScreen from './src/screens/profileScreen'

const AppStack = createStackNavigator({ 
  Home: HomeScreen,
  Chat: ChatScreen,
  Profile: ProfileScreen
});
const AuthStack = createStackNavigator({ Login: LoginScreen });


export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);