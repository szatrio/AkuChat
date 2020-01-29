import React, { Component } from 'react'
import { View, StyleSheet, TextInput, ScrollView, ActivityIndicator, Text, SafeAreaView, ToastAndroid, Image, TouchableOpacity, CameraRoll } from 'react-native'
import User from '../auth/user'
import firebase from 'firebase'
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker'

export default class profileScreen extends Component {
    static navigationOptions = {
        title: 'Profile'
    }

    state = {
        name: User.name,
        imageSrc: User.image? {uri : User.image} : require('../../assets/img/man.png'),
        upload: false,
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    _logOut = async () => {
        await AsyncStorage.clear()
        
        this.props.navigation.navigate('Auth')
    }

    changeImage = () => {
        const options = {
            quality: 0.7,
            allowsEditing:true,
            mediaType:'photo',
            noData: true,
            storageOptions: {
                skipBackkup:true,
                waitUntilSaved:true,
                path: 'images',
                cameraRoll: true
            }
        }
        ImagePicker.showImagePicker(options, response => {
            if(response.error){
                console.log(error)
            }else if(!response.didCancel){
                this.setState({
                    upload: true,
                    imageSrc: {uri: response.uri}
                }, this.uploadFile)
            }
        })
    }

    updateUser = () => {
        firebase
          .database()
          .ref('users')
          .child(User.email)
          .set(User);
          ToastAndroid.showWithGravity(
            'Changed was successfuly',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        )
      };

    updateUserImage = (imageUrl) => {
        User.image = imageUrl
        
        this.updateUser()

        this.setState({upload : false, imageSrc: { uri: imageUrl}})
    }

    uploadFile = async () => {
        const file = await this.uriToBlob(this.state.imageSrc.uri)
        // console.log(firebase.storage(), "ini uploadfile")
        firebase.storage().ref(`profile_pictures/${User.email}.png`)
            .put(file)
            .catch(err => console.log("errornya disini", err))
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                    // console.log("terpanggil updateuserimage")
                    this.updateUserImage(url)
                })
            .catch(error =>{
                // console.log("terpanggil error")
                this.setState({
                    upload: false,
                    imageSrc: require('../../assets/img/man.png')
                })
                ToastAndroid.showWithGravity(
                    'Error, Error on upload image',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                )
            })
    }

    uriToBlob = (uri) => {
        return new Promise((resolve, reject)=> {
            const xhr = new XMLHttpRequest()
            xhr.onload = function(){
                resolve(xhr.response)
            }
            xhr.onerror = function(){
                reject(new Error('Error on upload image'))
            }

            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })
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
            User.name = this.state.name
            this.updateUser()
            
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} style={styles.container}>
                <View style={{marginTop:'30%'}}>

                </View>
                <Image source={require('../../assets/img/coverchat.jpg')} style={styles.cover} />
                <TouchableOpacity onPress={this.changeImage}>
                    {
                        this.state.upload ? <ActivityIndicator size="large"/>:
                        <Image source={this.state.imageSrc}
                        style={styles.profilePic}
                        />
                    }
                </TouchableOpacity>

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
            </ScrollView>
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
        marginVertical:3,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8' 
    },
    container: {
        backgroundColor: '#E1E8EC',
        flex: 1,
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
    cover: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        opacity: 0.8,
        top: 0
    },
    profilePic: {
        width:100,
        height:100,
        borderRadius:50,
        resizeMode: 'cover',
        marginVertical:10,
        borderWidth: 4,
        borderColor: '#E1E8EC'
    },
});
