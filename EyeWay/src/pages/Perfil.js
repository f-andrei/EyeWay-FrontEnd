import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

export default Perfil = ({ navigation, route }) => {
    const isWeb = Platform.OS === 'web';

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = Platform.OS === 'android'
        ? "http://10.0.2.2:3000"
        : "http://localhost:3000";

    return (
        <View style={[
            styles.container,
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
            <View style={[styles.containerLogo]}>
                <Image
                    source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                    style={[
                        styles.logo,
                        Platform.OS === 'web' && {
                            width: 250,
                            height: 120,
                            marginBottom: 20
                        }
                    ]}
                />
            </View>

            <View style={styles.buttonContent}>
                <Ionicons name="person" size={isWeb ? 50 : 25} color="orange" />
                <Text style={styles.title}>Perfil do Usuário</Text>
            </View>
            {userData ? (
                <View style={[styles.card, isWeb && styles.webUserCard]}>
                     <TextInput style={styles.input} />
                     <TextInput style={styles.input} />
                     <TextInput style={styles.input} />

                    <TouchableOpacity style={[styles.updateButton, isWeb && styles.webButton]} onPress={atualizarPerfil}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="person-add-sharp" size={isWeb ? 28 : 14} color="black" />
                            <Text style={styles.buttonText}>Atualizar Perfil</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.deleteButton, isWeb && styles.webButton]} onPress={deletarConta}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="person-remove" size={isWeb ? 28 : 14} color="black" />
                            <Text style={styles.textInput}>Deletar Conta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.label}>Usuário não encontrado</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3E3C3C',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#fff',
        textAlign: 'center',
    },
    userCard: {
        backgroundColor: '#1E1E1E',
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
        minHeight: 300,
        alignItems: 'center',
        marginBottom: 20,
    },
    webUserCard: {
        maxWidth: '60%',
        padding: 40,
    },
    labelText: {
        color: "#ffffff",
        fontSize: 18,
        marginBottom: 8,
    },
    updateButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: '90%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '90%',
        alignItems: 'center',
    },
    webButton: {
        width: '70%',
        paddingVertical: 12,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }, containerLogo: {
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
});
