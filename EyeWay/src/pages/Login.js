import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    StyleSheet, 
    TextInput, 
    Platform,
    Dimensions 
} from 'react-native';
import { useStore } from '../store/globalStore';
import axios from 'axios';

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const globalStore = useStore();
    const { setAuthenticated } = useStore();

    const api_url = Platform.OS === 'android' ? "http://10.0.2.2:3000/login" : "http://localhost:3000/login";
    
    async function login() {
        try{
            console.log(email, senha);
            const { data } = await axios.post(api_url, { email, senha });
            if (data.token?.length){
                setAuthenticated(true);
                window.localStorage.setItem("token",data.token);
                globalStore.setUserId( data.user_id );
                console.log(globalStore.user_id);
            }
            else{
                alert("Erro ao logar");
            }
        }catch(err){
            console.log("Erro ao logar");
        }
    }

    return (
        <View style={[
            estilos.container,
            Platform.OS === 'web' && {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        ]}>
            <View style={[
                estilos.card,
                Platform.OS === 'web' && {
                    maxWidth: 400,
                    width: '90%',
                    padding: 40,
                    backgroundColor: '#2E2D2D',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginTop: 0,
                    marginBottom: 0
                }
            ]}>
                <View style={[estilos.containerLogo, { marginBottom: 40 }]}>
                    <Image
                        source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                        style={[
                            estilos.logo,
                            Platform.OS === 'web' && { 
                                width: 200,
                                height: 80,
                                marginBottom: 20
                            }
                        ]}
                    />
                </View>

                <Text style={[
                    estilos.textColor,
                    Platform.OS === 'web' && {
                        fontSize: 28,
                        marginBottom: 30,
                        color: '#5AB1BB'
                    }
                ]}>
                    Entre na sua conta
                </Text>

                <View style={{ width: '100%' }}>
                    <Text style={[
                        estilos.textInput,
                        Platform.OS === 'web' && {
                            color: '#5AB1BB',
                            marginBottom: 8
                        }
                    ]}>Email:</Text>
                    <TextInput 
                        onChangeText={setEmail}
                        placeholder='user@email.com'
                        style={[
                            estilos.input,
                            Platform.OS === 'web' && {
                                backgroundColor: '#1E1E1E',
                                borderColor: '#404040',
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 20,
                                color: '#FFFFFF',
                                outline: 'none',
                                width: '100%'
                            }
                        ]}
                        placeholderTextColor="#666"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={[
                        estilos.textInput,
                        Platform.OS === 'web' && {
                            color: '#5AB1BB',
                            marginBottom: 8
                        }
                    ]}>Senha:</Text>
                    <TextInput
                        onChangeText={setSenha}
                        placeholder='Senha'
                        style={[
                            estilos.input,
                            Platform.OS === 'web' && {
                                backgroundColor: '#1E1E1E',
                                borderColor: '#404040',
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 30,
                                color: '#FFFFFF',
                                outline: 'none',
                                width: '100%'
                            }
                        ]}
                        placeholderTextColor="#666"
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity 
                        onPress={login} 
                        style={[
                            estilos.buttonContainer,
                            Platform.OS === 'web' && {
                                backgroundColor: '#FF9C11',
                                padding: 14,
                                borderRadius: 8,
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: 20,
                                ':hover': {
                                    backgroundColor: '#FFB443',
                                    transform: 'translateY(-1px)'
                                }
                            }
                        ]}
                    >
                        <Text style={[
                            estilos.buttonStyle,
                            Platform.OS === 'web' && {
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        ]}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('SignUp')}
                        style={Platform.OS === 'web' && { 
                            alignItems: 'center',
                            marginTop: 10
                        }}
                    >
                        <Text style={[
                            estilos.signupText,
                            Platform.OS === 'web' && {
                                color: '#5AB1BB',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }
                        ]}>
                            Não possui uma conta?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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