import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

const FormInput = ({ label, placeholder, value, onChangeText, multiline = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={[
                styles.input,
                multiline && { height: 120, textAlignVertical: 'top' }
            ]}
            placeholderTextColor="#666"
            multiline={multiline}
            numberOfLines={multiline ? 5 : 1}
        />
    </View>
);

const FormSelect = ({ label, value, onValueChange, options }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={value}
                onValueChange={onValueChange}
                style={styles.picker}
                dropdownIconColor="#5AB1BB"
            >
                <Picker.Item label="Selecione uma opção" value="" />
                {options.map((option, index) => (
                    <Picker.Item label={option} value={option} key={index} />
                ))}
            </Picker>
        </View>
    </View>
);

export default function UpdateOperation({ route, navigation }) {
    const { infractionId } = route.params;
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

    const isWeb = Platform.OS === 'web';
    const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000" : "http://localhost:3000";

    const opcoesOcorrencia = [
        "Estacionado em frente ao portão",
        "Estacionado em vaga de carga e descarga",
        "Estacionado em vaga PCD sem carteirinha",
        "Estacionado em vaga 60+ sem carteirinha",
        "Estacionado na contra mão",
        "Estacionado em cima de calçada",
        "Outro"
    ];

    const opcoesVeiculo = ["Carro", "Motocicleta", "Ônibus", "Caminhão"];

    const opcoesStatus = ["Pendente", "Verificado", "Alerta Falso"];

    useEffect(() => {
        const fetchInfractionData = async () => {
            try {
                const response = await fetch(`${API_URL}/manualInfractions/${infractionId}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da infração');
                }
                const data = await response.json();
                const infraction = data.results[0];
                
                // Format the date to YYYY-MM-DD
                const formattedDate = new Date(infraction.date).toISOString().split('T')[0];
                setInfractionInfo({
                    date: formattedDate,
                    user: infraction.user,
                    adress: infraction.adress,
                    text: infraction.text,
                    status: infraction.status,
                    vehicle_type: infraction.vehicle_type,
                    infraction_type: infraction.infraction_type,
                    camera_id: infraction.camera_id
                });

                if (infraction.image) {
                    // Check if the image is already a base64 string
                    if (typeof infraction.image === 'string' && infraction.image.includes('base64')) {
                        setFoto(infraction.image);
                    } else {
                        // Convert array buffer to base64
                        const uint8Array = new Uint8Array(infraction.image.data || infraction.image);
                        const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                        const base64Image = `data:image/jpeg;base64,${btoa(binaryString)}`;
                        setFoto(base64Image);
                    }
                }
            } catch (error) {
                console.error('Error fetching infraction:', error);
                showAlert("Erro", "Não foi possível carregar os dados da infração");
            }
        };

        fetchInfractionData();
    }, [infractionId]);

    const showAlert = (title, message, onConfirm = null) => {
        if (isWeb) {
            window.alert(message);
            if (onConfirm) onConfirm();
        } else {
            Alert.alert(title, message, onConfirm ? [{ text: 'OK', onPress: onConfirm }] : undefined);
        }
    };

    const handleFoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            showAlert("Permissão Negada", "Permissão para acessar a galeria foi negada.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const base64 = await convertImageToBase64(result.assets[0].uri);
            setInfractionInfo(prev => ({ ...prev, imageData: base64 }));
            setFoto(result.assets[0].uri);
        }
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

    const handleUpdate = useCallback(async () => {
        try {
            // Prepare the image data
            let imageToSend;
            
            if (infractionInfo.imageData) {
                // If we have new image data from a new selection
                imageToSend = infractionInfo.imageData;
            } else if (foto) {
                // If we're using the existing image
                imageToSend = foto;
            }

            // Ensure date is in YYYY-MM-DD format
            const formattedDate = new Date(infractionInfo.date).toISOString().split('T')[0];

            const response = await fetch(`${API_URL}/manualInfractions/${infractionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...infractionInfo,
                    date: formattedDate,
                    image: imageToSend
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar a infração');
            }

            showAlert(
                "Sucesso",
                "Infração atualizada com sucesso!",
                () => navigation.replace('Infractions')
            );
        } catch (error) {
            console.error(error);
            showAlert("Erro", "Ocorreu um erro ao atualizar a infração. Tente novamente.");
        }
    }, [infractionInfo, infractionId, foto, navigation]);

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    <View style={styles.header}>
                        <Image
                            source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Atualizar Ocorrência</Text>
                    </View>

                    <View style={styles.formContent}>
                        <FormInput
                            label="Data da ocorrência"
                            placeholder="AAAA-MM-DD"
                            value={infractionInfo.date}
                            onChangeText={(text) => setInfractionInfo(prev => ({...prev, date: text}))}
                        />

                        <FormInput
                            label="Endereço da ocorrência"
                            placeholder="ex: R. Prof. João Cândido, 1213"
                            value={infractionInfo.adress}
                            onChangeText={(text) => setInfractionInfo(prev => ({...prev, adress: text}))}
                        />

                        <FormInput
                            label="Nomes dos Agentes na ocorrência"
                            placeholder="ex: João e Maria"
                            value={infractionInfo.user}
                            onChangeText={(text) => setInfractionInfo(prev => ({...prev, user: text}))}
                        />

                        <FormSelect
                            label="Tipo da ocorrência"
                            value={infractionInfo.infraction_type}
                            onValueChange={(value) => setInfractionInfo(prev => ({...prev, infraction_type: value}))}
                            options={opcoesOcorrencia}
                        />

                        <FormSelect
                            label="Tipo do Veículo"
                            value={infractionInfo.vehicle_type}
                            onValueChange={(value) => setInfractionInfo(prev => ({...prev, vehicle_type: value}))}
                            options={opcoesVeiculo}
                        />

                        <FormSelect
                            label="Status"
                            value={infractionInfo.status}
                            onValueChange={(value) => setInfractionInfo(prev => ({...prev, status: value}))}
                            options={opcoesStatus}
                        />

                        <FormInput
                            label="Observação"
                            placeholder="Digite aqui a observação da ocorrência..."
                            value={infractionInfo.text}
                            onChangeText={(text) => setInfractionInfo(prev => ({...prev, text: text}))}
                            multiline={true}
                        />

                        <View style={styles.imageSection}>
                            <Text style={styles.inputLabel}>Foto da ocorrência</Text>
                            <TouchableOpacity 
                                style={styles.imageButton} 
                                onPress={handleFoto}
                            >
                                <Ionicons name="camera-outline" size={24} color="#FFF" />
                                <Text style={styles.imageButtonText}>Alterar Foto</Text>
                            </TouchableOpacity>

                            {foto && (
                                <Image
                                    source={{ uri: foto }}
                                    style={styles.imagePreview}
                                    resizeMode="contain"
                                />
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleUpdate}
                        >
                            <Ionicons name="save-outline" size={24} color="#000" />
                            <Text style={styles.submitButtonText}>Atualizar ocorrência</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Navbar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        backgroundColor: '#3E3C3C',
        height: Platform.OS === 'web' ? '100vh' : '100%',
        overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
    },
    navbarContainer: {
        width: 200,
        backgroundColor: '#1B2B3A',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
    },
    mobileNavbar: {
        width: '100%',
        backgroundColor: '#1B2B3A',
        height: 60,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#3E3C3C',
        ...(Platform.OS === 'web' && {
            height: '100vh',
            overflow: 'auto',
        }),
    },
    scrollViewContent: {
        padding: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        paddingBottom: Platform.OS === 'web' ? 20 : 80,
        ...(Platform.OS === 'web' && {
            minHeight: '100%',
        }),
    },
    formContainer: {
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 600 : '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: Platform.OS === 'web' ? 200 : '80%',
        height: Platform.OS === 'web' ? 80 : 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#5AB1BB',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formContent: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 20,
        gap: 15,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        color: '#5AB1BB',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderColor: '#404040',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    pickerContainer: {
        backgroundColor: '#1E1E1E',
        borderColor: '#404040',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        color: '#FFFFFF',
        height: 50,
    },
    imageSection: {
        marginTop: 10,
    },
    imageButton: {
        backgroundColor: '#1E1E1E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderColor: '#404040',
        borderWidth: 1,
        gap: 8,
    },
    imageButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#1E1E1E',
    },
    submitButton: {
        backgroundColor: '#5AB1BB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        gap: 8,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        backgroundColor: '#1E1E1E',
        borderColor: '#404040',
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
        ...(Platform.OS === 'web' && {
            position: 'relative',
            '& select': {
                backgroundColor: '#1E1E1E',
                appearance: 'none',
                WebkitAppearance: 'none',
                padding: '12px',
                width: '100%',
                borderWidth: 0,
                outline: 'none',
                color: '#FFFFFF',
            },
            '& select option': {
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                padding: '12px',
            },
            '& select:focus': {
                outline: 'none',
                borderColor: '#5AB1BB',
            },
        }),
    },
    picker: {
        color: '#FFFFFF',
        height: 50,
        ...(Platform.OS === 'web' && {
            backgroundColor: '#1E1E1E',
        }),
    },
    submitButton: {
        backgroundColor: '#5AB1BB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        gap: 8,
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                backgroundColor: '#4A9AA3',
            },
        }),
    },
});