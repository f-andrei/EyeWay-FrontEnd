import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity, Image, TextInput, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../components/Navbar';
import { useStore } from '../store/globalStore';

export default Perfil = ({ navigation, route }) => {
    const isWeb = Platform.OS === 'web';
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const API_URL = Platform.OS === 'android'
        ? "http://10.0.2.2:3000"
        : "http://localhost:3000";

    const globalStore = useStore();
    
    useEffect(() => {
        console.log(globalStore.user_id)
        if (globalStore.user_id) {
            axios.get(`${API_URL}/users/${globalStore.user_id}`)
                .then(response => {
                    setUserData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados do usuário:", error);
                    setLoading(false);
                });
        }
    }, [globalStore.user_id]);

    const atualizarPerfil = async () => {
        await axios.put(`${API_URL}/users/${globalStore.user_id}`, userData);
        navigation.navigate('Home')
    };

    const deletarConta = async () => {
        await axios.delete(`${API_URL}/users/${globalStore.user_id}`);
        globalStore.setAuthenticated(false)
    };

    const setNome = (name) => {
        setUserData({...userData,name})
    }

    const setEmail = (email) => {
        setUserData({...userData,email})
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={{ width: '100%' }}
            >
                <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
                    <View style={[styles.containerLogo, isWeb && styles.webContainerLogo]}>
                        <Image
                            source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                            style={[styles.logo, isWeb && styles.webLogo]}
                        />
                    </View>

                    <View style={[styles.containerDescricao, isWeb && { width: '70%', marginTop: 20 }]}>
                        <View style={styles.header}>
                            <Ionicons name="person" size={isWeb ? 40 : 25} color="orange" />
                            <Text style={styles.textoDescricao}>Perfil do Usuário</Text>
                        </View>
                    </View>

                    {userData ? (
                        <View style={[styles.card, isWeb && styles.webUserCard]}>
                            <Text style={styles.textoBotao2}>Nome: {userData.name}</Text>
                            <Text style={styles.textoBotao2}>Email: {userData.email}</Text>
                            
                            <TouchableOpacity style={styles.botaoEnviar} onPress={() => navigation.navigate("UpdatePerfil")}>
                                <View style={styles.buttonContent}>
                                    <Ionicons name="person-add-sharp" size={isWeb ? 28 : 14} color="black" />
                                    <Text style={styles.textoBotao}>Atualizar Perfil</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botaoExcluir} onPress={deletarConta}>
                                <View style={styles.buttonContent}>
                                    <Ionicons name="person-remove" size={isWeb ? 28 : 14} color="black" />
                                    <Text style={styles.textoBotao}>Deletar Conta</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text style={styles.label}>Usuário não encontrado</Text>
                    )}
                </View>
            </ScrollView>
            <Navbar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3E3C3C',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 70,
    },
    contentWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    webContentWrapper: {
        maxWidth: 1200, 
        width: '99%',
        paddingHorizontal: 0,
    },
    containerLogo: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    webContainerLogo: {
        marginTop: 20,
        marginBottom: 40,
    },
    logo: {
        width: '80%',
        height: 120,
        resizeMode: 'contain',
    },
    webLogo: {
        width: 200,
        height: 80,
    },
    containerDescricao: {
        backgroundColor: '#3E3C3C',
        padding: Platform.OS === 'web' ? 20 : 15,
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        maxWidth: 800,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    textoDescricao: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'web' ? 20 : 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 40, 
        borderRadius: 15,
        width: Platform.OS === 'web' ? '90%' : '85%', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        marginBottom: 20,
    },
    webUserCard: {
        maxWidth: 600,
    },
    input: {
        backgroundColor: '#2E2E2E',
        color: '#FFFFFF',
        borderRadius: 5,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    botaoEnviar: {
        backgroundColor: '#FF9C11',
        borderRadius: 5,
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 8, 
    },
    botaoExcluir: {
        backgroundColor: '#e63946',
        borderRadius: 5,
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 8, 
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'web' ? 16 : 14,
        fontWeight: 'bold',
    },
    textoBotao2: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'web' ? 16 : 14,
        fontWeight: 'bold',
        marginVertical: 10, 
    },
    label: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 10,
    },
});