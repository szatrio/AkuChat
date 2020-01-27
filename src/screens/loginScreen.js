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
  Image
} from 'react-native';
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation'

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
    password: '',
    longitude: '',
    latitude: '',
  }

  handleChange = key => val =>{
    this.setState({[key]: val})
  }

  submitForm = async () => {
      Geolocation.getCurrentPosition(info => {
        console.log(info.coords.longitude, "long");
        console.log(info.coords.latitude, "lat");
        this.setState({
          longitude: info.coords.longitude,
          latitude: info.coords.latitude,
        })
      })
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
        User.name = this.state.name
        User.position.lat = this.state.latitude
        User.position.long = this.state.longitude
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
          <Image source={require('../../assets/img/coverchat.jpg')} style={styles.wall}/>
          <View style={styles.card}>
            <Image source={require('../../assets/img/akuchat.png')} style={styles.logo}/>
            <TextInput
            placeholder="Name"
            style={styles.input}
            value={this.state.name}
            onChangeText={this.handleChange('name')}
            />
            <TextInput
            placeholder="Phone number"
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
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wall: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.8
  },
  card: {
    backgroundColor: '#E1E8EC',
    width: '95%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    opacity:0.8
  },
  logo:{
    width: 150,
    height: 50,
    marginVertical:10
  },
  input: {
    padding: 10,
    marginVertical:3,
    borderWidth:1,
    borderColor:'#ccc',
    width:'90%',
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
    opacity:0.8
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
