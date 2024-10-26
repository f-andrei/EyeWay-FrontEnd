import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { useStore } from '../store/globalStore';
import axios from 'axios';

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const { setAuthenticated } = useStore();

    async function login() {

        try{
            console.log(email, senha);
            const { data } = await axios.post("http://localhost:3000/login", { email, senha });
            if (data.token?.length) {
                setAuthenticated(true);
                window.localStorage.setItem("token",data.token)
            }
            else{
                alert("Erro ao logar");
            }
        }catch(err){
            console.log("Erro ao logar");
        }
    
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.containerLogo}>
                <Image
                    source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                    style={estilos.logo}
                />
            </View>

            <View style={estilos.containerTexto}>
                <Text style={estilos.textColor}>
                    Entre na sua conta
                </Text>
            </View>

            <View style={estilos.card}>
                <Text style={estilos.textInput}>Email:</Text>
                <TextInput onChangeText={setEmail}
                    placeholder='user@email.com'
                    style={estilos.input}
                    placeholderTextColor="#b0b0b0"
                />

                <Text style={estilos.textInput}>Senha:</Text>
                <TextInput
                    onChangeText={setSenha}
                    placeholder='Senha'
                    style={estilos.input}
                    placeholderTextColor="#b0b0b0"
                    secureTextEntry
                />

                <TouchableOpacity onPress={login} style={estilos.buttonContainer}>
                    <Text style={estilos.buttonStyle}>Entrar</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={estilos.signupText}>Não possui uma conta?</Text>
            </TouchableOpacity>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E2D2D',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    containerLogo: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    logo: {
        width: '80%',
        height: 120,
        resizeMode: 'contain',
    },
    containerTexto: {
        marginBottom: 20,
        alignItems: 'center',
    },
    textColor: {
        fontSize: 26,
        color: '#5AB1BB',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 25,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        marginBottom: 20,
    },
    textInput: {
        fontSize: 16,
        color: '#5AB1BB',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    input: {
        width: '100%',
        borderRadius: 5,
        borderColor: '#404040',
        backgroundColor: '#333',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        color: '#FFF',
    },
    buttonContainer: {
        backgroundColor: '#FF9C11',
        borderRadius: 5,
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonStyle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupText: {
        color: '#5AB1BB',
        fontSize: 16,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});
