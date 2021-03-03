import React, { Component} from 'react'
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity}
from 'react-native'

import backgroundImage from '../../assets/imgs/login.jpg'
import commomStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSucess} from '../common'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = { ...initialState}

    signinOrSigup = () => {
        if(this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })

            showSucess('Usuario cadastrado!')
            this.setState({ ...initialState})
        } catch(e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
            email: this.state.email,
            password: this.state.password
        })
            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)  
        } catch (e) {
            showError(e)
        }
    }

    render () {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce( (t, a) => t && a)

        return (
            <ImageBackground source={backgroundImage} style={styles.backgound}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew && 
                    <AuthInput
                        nome='user' 
                        placeholder='Nome' 
                        value={this.state.nome}
                        onChangeText={name => this.setState({ name})}/>
                    }
                    <AuthInput
                        nome='at' 
                        placeholder='E-mail'
                        value={this.state.email}
                        onChangeText={email => this.setState({ email})}/>
                    <AuthInput
                        nome='lock' 
                        placeholder='Senha' 
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password})}/>
                        
                    {this.state.stageNew && 
                        <AuthInput
                            nome='asterisk' 
                            placeholder='Confirmar Senha' 
                            value={this.state.confirmPassword}
                            secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword})}/>
                    }

                    <TouchableOpacity onPress={this.signinOrSigup} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA'} ]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                style={{padding: 10}}
                onPress={() => this.setState({stageNew: !this.state.stageNew})}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta' : 'Ainda nao possui conta?'}
                    </Text>                    
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    backgound: {
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secundary,
        fontSize: 70,
        marginBottom: 10
    },
    subTitle: {
        fontFamily: commomStyles.fontFamily,
        color: commomStyles.colors.secundary,
        fontSize: 20, 
        color: 'white',
        textAlign: 'center',
        marginBottom: 10       
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    button: {
        backgroundColor: '#080',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        borderRadius: 10
    },
    buttonText: {
        fontFamily: commomStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})
