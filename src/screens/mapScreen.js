import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Modal, Dimensions, TouchableOpacity, TouchableHighlight } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import User from '../auth/user'
import firebase from 'firebase'

const lat_del = 0.0922
const long_del = lat_del
let dimension = Dimensions.get('window')
export default class mapScreen extends Component {

    constructor() {
        super();
        this.state = {
            //   mapRegion: null,
            latitude: 0,
            longitude: 0,
            userList: [],
            forceRefresh: Math.floor(Math.random() * 100),
            dbref: firebase.database().ref('users'),
            loading: true,
            modalVisible: false,
            personData: ''
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount = () => {
        console.log("eksekus")
        Geolocation.getCurrentPosition(info => {
            console.log(info.coords.longitude, "long");
            console.log(info.coords.latitude, "lat");
            this.setState({
                longitude: info.coords.longitude,
                latitude: info.coords.latitude,
            })
        })

        this.state.dbref.on('child_added', (val) => {
            let person = val.val()
            person.email = val.key
            if (person.email !== User.email && person.position) {
                this.setState((prevState) => {
                    return {
                        userList: [...prevState.userList, person],
                        loading: false
                    };
                })
            }
        })
    }


    render() {
        let { userList } = this.state;
        // console.log(this.state.loading, "ini state")
        // console.log(userList, "ini uselroa")
        if (this.state.loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 500 }}>
                    <Text>Loading...</Text>
                </View>
            )
        } else {
            let { personData } = this.state
            return (
                <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onDismiss={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.profModal}>
                                <View style={styles.contentModal}>
                                    <Image source={require('../../assets/img/coverchat.jpg')} style={styles.cover} />
                                    <Image source={(personData.image) ? { uri: personData.image } : require('../../assets/img/man.png')}
                                        style={styles.profilePic}
                                    />
                                    <Text style={{ fontSize: 15 }}>{personData.email}</Text>
                                    <Text style={{ fontSize: 18 }}>{personData.name}</Text>
                                    <View style={{ flexDirection: 'row', margin: 20 }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible)
                                            this.props.navigation.navigate('Chat', { item: personData })
                                        }}>
                                            <View style={styles.viewChat}>
                                                <Text style={styles.btnChat}>
                                                    CHAT
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible);
                                        }} >
                                            <View style={styles.viewHide}>
                                                <Text style={styles.btnHide}>
                                                    CANCEL
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <MapView
                        key={this.state.forceRefresh}
                        style={styles.map}
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: lat_del,
                            longitudeDelta: long_del
                        }}>
                        <Marker coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: lat_del,
                            longitudeDelta: long_del
                        }}
                            title="You are here"
                        >
                            <Image source={{ uri: User.image }} style={styles.marker} />
                        </Marker>
                        {userList.map(u => {
                            return (
                                <>
                                    <Marker
                                        key={u.email}
                                        title={u.name}
                                        coordinate={{
                                            latitude: u.position.lat,
                                            longitude: u.position.long,
                                            latitudeDelta: lat_del,
                                            longitudeDelta: long_del
                                        }}
                                        onPress={() => {
                                            this.setModalVisible(true)
                                            this.setState({
                                                personData: u
                                            })
                                        }}
                                    >
                                        <Image source={(u.image) ? { uri: u.image } : require('../../assets/img/man.png')} style={styles.markerOther} />
                                    </Marker>

                                </>
                            )
                        })}

                    </MapView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    map: {
        height: '100%'
    },
    marker: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'red'
    },
    markerOther: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'blue'
    },
    profModal: {
        top: dimension.height / 5,
        width: 300,
        height: 300,
        borderRadius: 2,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 50 },
        shadowOpacity: 5,
        shadowRadius: 100,
        elevation: 10,
    },
    contentModal: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover',
        marginVertical: 10,
        borderWidth: 4,
        borderColor: 'white'
    },
    cover: {
        width: '100%',
        height: 112,
        position: 'absolute',
        opacity: 0.8,
        top: -50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    btnChat: {
        color: '#F8F8F8',
    },
    viewChat: {
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 74,
        borderRadius: 6,
        backgroundColor: '#BAC373',
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnHide: {
        color: '#F8F8F8',
    },
    viewHide: {
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 74,
        borderRadius: 6,
        backgroundColor: '#E75A5F',
        marginHorizontal: 10,
    }
})
