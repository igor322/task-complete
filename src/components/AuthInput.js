import React from 'react'
import { View, TextInput, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    return (
        <View style={styles.container}>
            <Icon name={props.nome} size={20} style={styles.icon}/>
            <TextInput {...props} style={styles.input}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    icon: {
        color: '#333',
        marginLeft: 10
    },
    input: {
        marginLeft: 15,
        width: '70%'
    }
})