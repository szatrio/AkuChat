import React from 'react'
import { SafeAreaView, Image, View, ScrollView, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import User from '../auth/user'
import firebase from 'firebase'



export default class HomeScreen extends React.Component{
    static navigationOptions = {
            title: 'Chats',
            // headerRight: (() =>
            //     <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
            //         <Image source={require('../../assets/img/man.png')} style={styles.profilePic} />
            //     </TouchableOpacity>
            // )User.image? {uri : User.image} : require('../../assets/img/man.png')
    }

    state = {
        users: [],
        dbref: firebase.database().ref('users')
    }

    componentDidMount(){
        this.state.dbref.on('child_added', (val)=>{
            let person = val.val()
            person.email = val.key
            // console.log(person, "ini person")
            // this.state.users.push(person)
            // console.log(this.state.users, "ini uersssss")
            // console.log(User.email, "in user name")
            // console.log(person.email)
            if(person.email === User.email){
                User.name = person.name
                User.image = person.image ? person.image : null
            }else{
                this.setState((prevState)=>{
                    return {
                        users: [...prevState.users, person],
                      };
                })
            }
        })
    }

   componentWillUnmount(){
       this.state.dbref.off()
   }
    
    render(){
        console.log(this.state.users, "ini users")
        return (
            <SafeAreaView>
                <ScrollView>
                    {this.state.users.map(u => 
                        <TouchableOpacity style={styles.name} onPress={() => this.props.navigation.navigate('Chat', {item: u})}>
                            <Image source={u.image? {uri:u.image}:require('../../assets/img/man.png')}
                            style={styles.imageList}/>
                            <Text key={u.email} style={styles.textList}>
                                {u.name}
                            </Text>
                        </TouchableOpacity>
                    )}    
                </ScrollView>
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
      borderBottomWidth:1,
      flexDirection: 'row'
    },
    profilePic: {
      width:32,
      height:32,
      marginHorizontal:10
    },
    imageList: {
        width:40,
        height:40,
        resizeMode: 'cover',
        borderRadius: 50
    },
    textList: {
        paddingTop:10,
        marginLeft: 10
    }
  });