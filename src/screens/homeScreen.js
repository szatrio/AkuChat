import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import User from '../auth/user'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'

export default class HomeScreen extends React.Component{
    static navigationOptions = {
        title: 'Chats'
    }

    state = {
        users: []
    }

    componentWillMount(){
        let dbRef = firebase.database().ref('users')
        dbRef.on('child_added', (val)=>{
            let person = val.val()
            person.email = val.key
            this.setState((prevState)=>{
                return {
                    users: [prevState.users, person]
                }
            })
        })
    }

    _logOut = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Auth')
    }

                // <TouchableOpacity onPress={this._logOut}>
                //     <Text>Logout</Text>
                // </TouchableOpacity>
    renderRow = ({item}) => {
        return(
            <TouchableOpacity style={styles.name} onPress={() => this.props.navigation.navigator('Chat', item)}>
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    
    render(){
        return (
            <SafeAreaView>
                <FlatList 
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.email}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // container: {
    //   backgroundColor: '#E1E8EC',
    //   flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center'
    // },
    name: {
      padding:10,
      borderBottomColor: '#ccc',
      borderBottomWidth:1
    }
  });