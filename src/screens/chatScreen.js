import React, { Component } from 'react'
import { KeyboardAvoidingView, View, Platform, Image, Animated, Keyboard, Dimensions, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import firebase from 'firebase'
import User from '../auth/user'
import { Header } from 'react-navigation-stack'

const isAndroid = Platform.OS === 'android'

export default class chatScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        // console.log(navigation.getParam("name"),"ini navigation")
        return {
            title: null,
            headerLeft: (() =>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../assets/img/man.png')} style={styles.profilePic} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 14 }}>
                                {navigation.getParam('item').name}
                            </Text>
                            <Text style={{ fontSize: 11 }}>
                                Online
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            person: {
                name: this.props.navigation.getParam('item').name,
                email: this.props.navigation.getParam('item').email
            },
            textMessage: '',
            messageList: [],
            dbRef: firebase.database().ref('messages')
        }
        this.keyboardHeight = new Animated.Value(0)
        this.bottomPadding = new Animated.Value(60)
    }

    componentDidMount() {
        this.keyboardShowListener = Keyboard.addListener(isAndroid ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => this.keyboardEvent(e, true))

        this.keyboardShowListener = Keyboard.addListener(isAndroid ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => this.keyboardEvent(e, false))

        this.state.dbRef.child(User.email).child(this.state.person.email)
            .on('child_added', (value) => {
                console.log(value.val(), "ini value")
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                }
                )
            })
    }

    keyboardEvent = (event, isShow) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? 60 : 0
            }),
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? 120 : 60
            })
        ]).start()
    }

    convertTime = time => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }

    handleText = key => val => {
        this.setState({ [key]: val })
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgId = this.state.dbRef.child(User.email).child(this.state.person.email).push().key
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.email
            }
            updates[User.email + '/' + this.state.person.email + '/' + msgId] = message
            updates[this.state.person.email + '/' + User.email + '/' + msgId] = message
            this.state.dbRef.update(updates)
            this.setState({ textMessage: '' })
        }
    }

    renderRow = ({ item }) => {
        console.log(item, "ini item")
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: item.from === User.email ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.email ? '#00897B' : '#7CB342',
                borderRadius: 5,
                marginBottom: 10
            }}>
                <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 12 }}>
                    {this.convertTime(item.time)}
                </Text>
            </View>
        )
    }

    render() {
        // console.log(this.props.navigation.getParam('item').name, "ini props navigation")
        let { height } = Dimensions.get('window')
        console.log(this.state.messageList, 'ini messagelist')
        return (
            <KeyboardAvoidingView
            keyboardVerticalOffset = {Header.HEIGHT -1000} // adjust the value here if you need more padding
            style = {{ flex: 1 }}
            behavior = "padding" >
            {/* // <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}> */}
                {/* <Animated.View style={[styles.aniView, { bottom: this.keyboardHeight }]}> */}
                {/* </Animated.View> */}
                <FlatList
                    style={{ padding: 10, height: height * 0.7 }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                />
                {/* <SafeAreaView style={{flex:1}}> */}
                
                    <View style={styles.rowInput}>
                        <TextInput
                            style={styles.input}
                            value={this.state.textMessage}
                            onChangeText={this.handleText('textMessage')}
                            placeholder="Type message..."
                        />
                        <TouchableOpacity onPress={this.sendMessage}>
                            <View style={styles.sendImg}>
                                <Image source={require('../../assets/img/send.png')} style={styles.send} />
                            </View>
                        </TouchableOpacity>
                    </View>
                
                {/* </SafeAreaView> */}
            {/* </KeyboardAvoidingView> */}
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '84%'
    },
    rowInput: {
        // paddingTop: '28%',
        flexDirection: 'row',
        alignItems: 'center',
        // height: '70%'
        margin: 3,
    },
    sendImg: {
        padding: 5,
        margin: 8,
        backgroundColor: '#4C5175',
        borderRadius: 50,
        width: 40,
        height: 40,
    },
    send: {
        tintColor: 'white',
        marginTop: 3,
        width: 25,
        height: 25,
    },
    profilePic: {
        width: 32,
        height: 32,
        marginHorizontal: 10,
    },
    aniView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        margin: 1
    }
});