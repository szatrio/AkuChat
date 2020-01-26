import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import MapView,{Marker} from 'react-native-maps'

export default class mapScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <MapView
                style={styles.map}
                initialRegion={{
                    latitude:-7.758487,
                    longitude:110.378197,
                    latitudeDelta: 0.09,
                    longitudeDelta:0.092
                }}>

                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 400
    },
    map: {
        height: 400
    }
})
