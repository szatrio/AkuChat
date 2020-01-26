/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import User from '../auth/user'

console.disableYellowBox = true

class LoginScreen extends React.Component {

  static navigationOptions = {
    headerShown: false
  }

  state = {
    email: '',
    name: '',
    password: ''
  }

  handleChange = key => val =>{
    this.setState({[key]: val})
  }

  submitForm = async () => {
      if(this.state.name.length < 4){
        ToastAndroid.showWithGravity(
          'Your name too short',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }else if(this.state.password.length < 7){
        ToastAndroid.showWithGravity(
          'Your password too weak',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }else{
        await AsyncStorage.setItem('userEmail', this.state.email)
        // console.log(this.props, "ini props")
        User.email = this.state.email
        this.updateUser()
        this.props.navigation.navigate('App')
      }
  }

    updateUser = () => {
      firebase
        .database()
        .ref('users')
        .child(User.email)
        .set(User);
        ToastAndroid.showWithGravity(
          'Login was successfuly',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
      )
    };

  render(){
    // console.log(this.state)
    return (
      <>
        <View style={styles.container}>
          <View style={styles.card}>
            <TextInput
            placeholder="Name"
            style={styles.input}
            value={this.state.name}
            onChangeText={this.handleChange('name')}
            />
            <TextInput
            placeholder="Email"
            email
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleChange('email')}
            />
            <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={this.state.password}
            onChangeText={this.handleChange('password')}
            />
            <TouchableOpacity onPress={this.submitForm}>
              <Text style={styles.buttonRegist}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>       
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4C5175',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#E1E8EC',
    width: '95%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  input: {
    padding: 10,
    marginVertical:3,
    borderWidth:1,
    borderColor:'#ccc',
    width:'90%',
    borderRadius: 6,
    backgroundColor: '#F8F8F8'
  },
  buttonRegist: {
    padding: 10,
    marginVertical:5,
    borderWidth:1,
    borderColor:'#ccc',
    width:'90%',
    borderRadius: 6,
    backgroundColor: '#4C5175',
    color:'#F8F8F8'
  }
});

export default LoginScreen;
