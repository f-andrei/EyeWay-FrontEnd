import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { useStore } from '../store/globalStore';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Navbar from '../components/Navbar';

export default function Operation({ navigation }) {
    // State declarations
    const [foto, setFoto] = useState(null);
    const [infractionInfo, setInfractionInfo] = useState({
        date: '',
        user: '',
        adress: '',
        image: '',
        text: '',
        status: '',
        vehicle_type: '',
        infraction_type: '',
        camera_id: -1
    });

    // Constants
    const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000" : "http://localhost:3000";
    const isWeb = Platform.OS === 'web';

    const opcoesOcorrencia = [
        "Estacionamento em frente ao portão",
        "Estacionado em vaga de carga e descarga",
        "estacionamento vaga PCD sem carteirinha",
        "estacionamento vaga 60+ sem carteirinha",
        "Estacionado na contra mão",
        "Estacionado em cima de calçada",
        "Outro"
    ];

    const opcoesVeiculo = [
        "Carro",
        "Motocicleta",
        "Ônibus",
        "Caminhão",
    ];

    // Helper functions
    const saveInfractionData = async (infractionData) => {
        const response = await fetch(`${API_URL}/manualInfractions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(infractionData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar a infração');
        }

        return response.json();
    };

    const convertImageToBase64 = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // Event handlers
    const handleFoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permissão para acessar a galeria foi negada.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const base64 = await convertImageToBase64(result.assets[0].uri);
            setInfractionInfo(prev => ({
                ...prev,
                imageData: base64
            }));
            setFoto(result.assets[0].uri);
        }
    };

    const handleSave = useCallback(async () => {
        const requiredFields = {
            date: infractionInfo.date,
            user: infractionInfo.user,
            adress: infractionInfo.adress, // Matching backend spelling
            text: infractionInfo.text,
            vehicle_type: infractionInfo.vehicle_type,
            infraction_type: infractionInfo.infraction_type,
            imageData: infractionInfo.imageData
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || String(value).trim() === '')
            .map(([key]) => key);

        if (missingFields.length > 0) {
            const message = `Por favor, preencha os seguintes campos obrigatórios: ${missingFields
                .map(field => field.charAt(0).toUpperCase() + field.slice(1))
                .join(', ')}`;

            if (isWeb) {
                window.alert(message);
            } else {
                Alert.alert("Campos Obrigatórios", message);
            }
            return;
        }

        try {
            const infractionData = {
                date: infractionInfo.date,
                user: infractionInfo.user,
                adress: infractionInfo.adress,
                text: infractionInfo.text,
                status: "Pendente",
                vehicle_type: infractionInfo.vehicle_type,
                infraction_type: infractionInfo.infraction_type,
                image: infractionInfo.imageData,
                camera_id: -1
            };

            await saveInfractionData(infractionData);

            const successMessage = "Infração cadastrada com sucesso!";
            const handleSuccess = () => {
                setInfractionInfo({
                    date: '',
                    user: '',
                    adress: '',
                    image: '',
                    text: '',
                    status: '',
                    vehicle_type: '',
                    infraction_type: '',
                    camera_id: -1
                });
                navigation.navigate('Infractions');
            };

            if (isWeb) {
                window.alert(successMessage);
                handleSuccess();
            } else {
                Alert.alert("Sucesso", successMessage, [
                    { text: "OK", onPress: handleSuccess }
                ]);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.message || "Ocorreu um erro ao salvar a infração. Tente novamente.";

            if (isWeb) {
                window.alert(errorMessage);
            } else {
                Alert.alert("Erro", errorMessage);
            }
        }
    }, [infractionInfo, navigation]);

    // Render
    return (
        <View style={[
            estilos.container,
            isWeb && {
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
                    isWeb && {
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
                    <View style={estilos.containerLogo}>
                        <Image
                            source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                            style={[
                                estilos.logo,
                                isWeb && {
                                    width: 200,
                                    height: 80,
                                    marginBottom: 20
                                }
                            ]}
                        />
                    </View>

                    <Text style={[
                        estilos.textColor,
                        isWeb && {
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
                            isWeb && {
                                color: '#5AB1BB',
                                marginBottom: 8
                            }
                        ]}>Data da ocorrência</Text>
                        <TextInput
                            placeholder='AAAA-MM-DD'
                            value={infractionInfo.date}
                            onChangeText={(text) => setInfractionInfo(prev => ({...prev, date: text}))}
                            style={[
                                estilos.input,
                                isWeb && {
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
                            isWeb && {
                                color: '#5AB1BB',
                                marginBottom: 8
                            }
                        ]}>Endereço da ocorrência</Text>
                        <TextInput
                            placeholder='ex: R. Prof. João Cândido, 1213'
                            value={infractionInfo.adress}
                            onChangeText={(text) => setInfractionInfo(prev => ({
                                ...prev, 
                                adress: text
                            }))}
                            style={[
                                estilos.input,
                                isWeb && {
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
                            isWeb && {
                                color: '#5AB1BB',
                                marginBottom: 8
                            }
                        ]}>Nomes dos Agentes na ocorrência:</Text>
                        <TextInput
                            placeholder='ex: João e Maria'
                            value={infractionInfo.user}
                            onChangeText={(text) => setInfractionInfo(prev => ({
                                ...prev, 
                                user: text
                            }))}
                            style={[
                                estilos.input,
                                isWeb && {
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
                            <Picker
                                selectedValue={infractionInfo.infraction_type}
                                onValueChange={(itemValue) => setInfractionInfo(prev => ({
                                    ...prev,
                                    infraction_type: itemValue
                                }))}
                                style={Platform.OS === 'ios' ? estilos.pickerIOS : estilos.picker}
                                dropdownIconColor="#5AB1BB"
                            >
                                <Picker.Item label="Selecione uma opção" value="" />
                                {opcoesOcorrencia.map((opcao, index) => (
                                    <Picker.Item label={opcao} value={opcao} key={index} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={estilos.textInput}>Tipo do Veículo:</Text>
                        <View style={estilos.pickerContainer}>
                            <Picker
                                selectedValue={infractionInfo.vehicle_type}
                                onValueChange={(itemValue) => setInfractionInfo(prev => ({
                                    ...prev,
                                    vehicle_type: itemValue
                                }))}
                                style={Platform.OS === 'ios' ? estilos.pickerIOS : estilos.picker}
                                dropdownIconColor="#5AB1BB"
                            >
                                <Picker.Item label="Selecione uma opção" value="" />
                                {opcoesVeiculo.map((opcao, index) => (
                                    <Picker.Item label={opcao} value={opcao} key={index} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={estilos.textInput}>Observação:</Text>
                        <TextInput
                            placeholder='Digite aqui a observação da ocorrência...'
                            multiline={true}
                            numberOfLines={10}
                            value={infractionInfo.text}
                            onChangeText={(text) => setInfractionInfo(prev => ({
                                ...prev,
                                text: text
                            }))}
                            style={[
                                estilos.input,
                                isWeb && {
                                    backgroundColor: '#1E1E1E',
                                    borderColor: '#404040',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    padding: 12,
                                    marginBottom: 20,
                                    color: '#FFFFFF',
                                    outline: 'none',
                                    width: '100%',
                                    height: 200,
                                    textAlign: 'start',
                                    textAlignVertical: 'top'
                                }
                            ]}
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                            keyboardType="default"
                        />

                        <Text style={estilos.textInput}>Enviar foto:</Text>
                        <TouchableOpacity style={estilos.buttonContainer} onPress={handleFoto}>
                            <Text style={estilos.buttonStyle}>Selecionar Foto</Text>
                        </TouchableOpacity>

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
                                isWeb && {
                                    backgroundColor: '#FF9C11',
                                    padding: 14,
                                    borderRadius: 8,
                                    width: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    marginBottom: 20,':hover': {
                                        backgroundColor: '#FFB443',
                                        transform: 'translateY(-1px)'
                                    }
                                }
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={[
                                estilos.buttonStyle,
                                isWeb && {
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
    pickerIOS: {
        color: '#FFF',
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