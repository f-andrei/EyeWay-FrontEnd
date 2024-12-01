import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Platform,
    ScrollView,
} from 'react-native';
import { useStore } from '../store/globalStore';
import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';


import Navbar from '../components/Navbar';

export default function Operation({ navigation }) {
    const [tipoOcorrencia, setTipoOcorrencia] = useState('');
    const [foto, setFoto] = useState(null);


    const handleFoto = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setFoto(response.assets[0].uri); // Define a URI da foto selecionada
            }
        });
    };

    const handleOperation = async () => {
        console.log("Tipo de ocorrência:", tipoOcorrencia);
        console.log("Foto selecionada:", foto);
    };
    
    const opcoesOcorrencia = [
        "Estacionamento em frente ao portão",
        "Estacionado em vaga de carga e descarga",
        "estacionamento vaga PCD sem carteirinha",
        "estacionamento vaga 60+ sem carteirinha",
        "Estacionado na contra mão",
        "Estacionado em cima de calçada",
        "Outro"
    ];



    const api_url = Platform.OS === 'android' ? "http://10.0.2.2:3000/users" : "http://localhost:3000/users";

    const isWeb = Platform.OS === 'web';

    async function Operation() {

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

            <ScrollView 
                contentContainerStyle={estilos.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >

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
                <View style={[estilos.containerLogo]}>
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
                    Operação externa
                </Text>

                <View style={{ width: '100%' }}>
                    <Text style={[
                        estilos.textInput,
                        Platform.OS === 'web' && {
                            color: '#5AB1BB',
                            marginBottom: 8
                        }
                    ]}>Data da ocorrência</Text>
                    <TextInput
                        placeholder='01/12/2020'
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
                    />

                    <Text style={[
                        estilos.textInput,
                        Platform.OS === 'web' && {
                            color: '#5AB1BB',
                            marginBottom: 8
                        }
                    ]}>Endereço da ocorrência</Text>
                    <TextInput
                        placeholder='ex: R. Prof. João Cândido, 1213'
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
                        keyboardType="default"
                    />

                    <Text style={[
                        estilos.textInput,
                        Platform.OS === 'web' && {
                            color: '#5AB1BB',
                            marginBottom: 8
                        }
                    ]}>Nomes dos Agentes na ocorrência:</Text>
                    <TextInput
                        placeholder='ex: João e Maria'
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
                        keyboardType="default"
                    />

                    <Text style={estilos.textInput}>Tipo da ocorrência:</Text>

                    <View style={estilos.pickerContainer}>
                        {/* <Picker
                            selectedValue={tipoOcorrencia}
                            onValueChange={(itemValue) => setTipoOcorrencia(itemValue)}
                            style={Platform.OS === 'ios' ? estilos.pickerIOS : estilos.picker}
                            dropdownIconColor="#5AB1BB" // Cor do ícone para Android
                        >
                            <Picker.Item label="Selecione uma opção" value="" />
                            {opcoesOcorrencia.map((opcao, index) => (
                                <Picker.Item label={opcao} value={opcao} key={index} />
                            ))}
                        </Picker> */}
                    </View>

                    <Text style={estilos.textInput}> Observação:</Text>

                    <TextInput
                        placeholder='Digite aqui a observação da ocorrência...'
                        multiline={true}
                        numberOfLines={10}
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
                                width: '100%',
                                height: 100,
                                textAlign: 'start',
                                height: 200,
                                textAlignVertical: 'top'
                        }]}
                        placeholderTextColor="#666"
                        autoCapitalize="none"
                        keyboardType="default"
                    />

                    <Text style={estilos.textInput}>Enviar foto:</Text>
                    <TouchableOpacity style={estilos.buttonContainer} onPress={handleFoto}>
                        <Text style={estilos.buttonStyle}>Selecionar Foto</Text>
                    </TouchableOpacity>

                    {/* Pré-visualização da foto */}
                    {foto && (
                        <Image
                            source={{ uri: foto }}
                            style={estilos.preview}
                            resizeMode="contain"
                        />
                    )}

                    <TouchableOpacity
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
                        ]}>Cadastrar ocorrência</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
            <Navbar navigation={navigation} />
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
        paddingTop: Platform.OS === 'web' ? 0 : 30,
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
    pickerContainer: {
        width: '100%',
        backgroundColor: '#333',
        borderRadius: 5,
        borderColor: '#404040',
        borderWidth: 1,
        marginBottom: 15,
    },
    picker: {
        color: '#FFF',
        backgroundColor: '#333',
        height: 50,
    },
    pickerItem: {
        color: '#FFF',
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 15,
    },
    preview: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 5,
        borderColor: '#404040',
        borderWidth: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'web' ? 20 : 70,
    },
});