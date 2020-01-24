import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Text, SafeAreaView, ToastAndroid, TouchableOpacity } from 'react-native'
import User from '../auth/user'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'

export default class profileScreen extends Component {
    static navigationOptions = {
        title: 'Profile'
    }

    state = {
        name: User.name
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    _logOut = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Auth')
    }

    changeName = async () => {
        // await console.log(this.state.name, "ini state name")
        if (this.state.name.length < 4) {
            ToastAndroid.showWithGravity(
                'Your name too short',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            )
        } else if (User.name !== this.state.name) {
            firebase
                .database()
                .ref('users')
                .child(User.email)
                .set({ name: this.state.name })

            User.name = this.state.name
            ToastAndroid.showWithGravity(
                'Name was changed',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            )
        }
    }

    render() {
        console.log(this.state.name, "ini state ame")
        return (
            <SafeAreaView style={styles.container}>

                <Text style={styles.paragraph}>
                    {User.email}
                </Text>
                <Text style={styles.paragraph}>
                    {User.name}
                </Text>

                <TextInput
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                    style={styles.input}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.changeName}>
                        <Text style={styles.buttonUpdate}>
                            UPDATE
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._logOut} >
                        <Text style={styles.buttonLogout}>
                            LOGOUT
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 20,
        marginBottom: 4
    },
    input: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8' 
    },
    container: {
        backgroundColor: '#E1E8EC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonUpdate: {
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 74,
        borderRadius: 6,
        backgroundColor: '#4C5175',
        color: '#F8F8F8',
        marginHorizontal: 10,
    },
    buttonLogout: {
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 74,
        borderRadius: 6,
        backgroundColor: '#E75A5F',
        color: '#F8F8F8',
        marginHorizontal: 10,
    },
});
