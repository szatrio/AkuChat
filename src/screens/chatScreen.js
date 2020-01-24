import React, { Component } from 'react'
import { SafeAreaView, View, Dimensions, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import User from '../auth/user'

export default class chatScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        // console.log(navigation.getParam("name"),"ini navigation")
        return {
            title: navigation.getParam('item').name
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
            messageList: []
        }
    }

    componentDidMount(){
        firebase.database().ref('messages').child(User.email).child(this.state.person.email)
            .on('child_added', (value)=>{
                console.log(value.val(),"ini value")
                this.setState((prevState)=>{
                    return{
                        messageList: [...prevState.messageList, value.val()]
                    }
                }
                )
            })
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
            let msgId = (await firebase
                .database()
                .ref('messages')
                .child(User.email)
                .child(this.state.person.email)
                .push()).key
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.email
            }
            updates['messages/' + User.email + '/' + this.state.person.email + '/' + msgId] = message
            updates['messages/' + this.state.person.email + '/' + User.email + '/' + msgId] = message
            firebase.database().ref().update(updates)
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
        let { height, width } = Dimensions.get('window')
        console.log(this.state.messageList, 'ini messagelist')
        return (
            <SafeAreaView>
                <View style={styles.rowInput}>
                    <FlatList
                        style={{ padding: 10, height: height * 0.7 }}
                        data={this.state.messageList}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: height * 0.3, margin: 1}}>
                        <TextInput
                            style={styles.input}
                            value={this.state.textMessage}
                            onChangeText={this.handleText('textMessage')}
                            placeholder="Type message..."
                        />
                        <TouchableOpacity onPress={this.sendMessage}>
                            <Text style={styles.send}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '80%'
    },
    rowInput: {
        paddingTop: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        height: '70%'
    },
    send: {
        padding: 10,
        margin:4,
        backgroundColor: '#4C5175',
        color:'white',
        borderRadius:50
    }
});