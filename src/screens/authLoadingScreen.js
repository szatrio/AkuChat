import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'firebase'

import User from '../auth/user'

export default class AuthLoadingScreen extends React.Component {
  state = {
    firebaseConfig : {
      apiKey: "AIzaSyDj38_EIQXnscfsQwJD-zuV9malhRv6gTk",
      authDomain: "akuchat-86b91.firebaseapp.com",
      databaseURL: "https://akuchat-86b91.firebaseio.com",
      projectId: "akuchat-86b91",
      storageBucket: "akuchat-86b91.appspot.com",
      messagingSenderId: "455620294319",
      appId: "1:455620294319:web:420b2a4a16548896c4865a",
      measurementId: "G-8HF6JMCBQG"
      }
  }
  
  componentDidMount() {
    this._bootstrapAsync();
    firebase.initializeApp(this.state.firebaseConfig)
  }

  // componentWillMount(){
  //   const firebaseConfig = {
  //     apiKey: "AIzaSyDj38_EIQXnscfsQwJD-zuV9malhRv6gTk",
  //     authDomain: "akuchat-86b91.firebaseapp.com",
  //     databaseURL: "https://akuchat-86b91.firebaseio.com",
  //     projectId: "akuchat-86b91",
  //     storageBucket: "akuchat-86b91.appspot.com",
  //     messagingSenderId: "455620294319",
  //     appId: "1:455620294319:web:420b2a4a16548896c4865a",
  //     measurementId: "G-8HF6JMCBQG"
  //     };
  //     firebase.initializeApp(firebaseConfig)
  // }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.email = await AsyncStorage.getItem('userEmail');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}