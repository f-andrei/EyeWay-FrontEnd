import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../components/Navbar';
import { useStore } from '../store/globalStore';

export default UpdatePerfil = ({ navigation, route }) => {
    const isWeb = Platform.OS === 'web';

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const API_URL = Platform.OS === 'android'
        ? "http://10.0.2.2:3000"
        : "http://localhost:3000";

    const globalStore = useStore();
    
    useEffect(() => {
        console.log(globalStore.user_id);
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
        navigation.navigate('Home');
    };

    const setNome = (name) => {
        setUserData({ ...userData, name });
    };

    const setEmail = (email) => {
        setUserData({ ...userData, email });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                style={Platform.OS === 'web' ? { height: 'calc(100vh - 60px)', width: '100%' } : { flex: 1 }}
            >
                <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
                    {!isWeb && (
                        <View style={styles.containerLogo}>
                            <Image
                                source={require('../assets/LogoComNomeCompletoEyeWay.png')}
                                style={styles.logo}
                            />
                        </View>
                    )}

                    <View style={[styles.containerDescricao, isWeb && { width: '70%', marginTop: 40 }]}>
                        <View style={styles.header}>
                            <Ionicons name="person" size={isWeb ? 40 : 25} color="orange" />
                            <Text style={styles.textoDescricao}>Atualizar Perfil do Usuário</Text>
                        </View>
                    </View>

                    {userData ? (
                        <View style={[styles.card, isWeb && styles.webUserCard]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                placeholderTextColor="#AAA"
                                value={userData.name}
                                onChangeText={setNome}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                placeholderTextColor="#AAA"
                                value={userData.email}
                                onChangeText={setEmail}
                            />
                            
                            <Text style={styles.textoBotao2}>
                                Edite ou reescreva as informações nos campos desejados. Após realizar as alterações, clique no botão "Atualizar Perfil" para salvar as mudanças.
                            </Text>
                            <TouchableOpacity style={styles.botaoEnviar} onPress={atualizarPerfil}>
                                <View style={styles.buttonContent}>
                                    <Ionicons name="person-add-sharp" size={isWeb ? 28 : 14} color="black" />
                                    <Text style={styles.textoBotao}>Atualizar Perfil</Text>
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
        paddingBottom: 70, // Espaço para evitar sobreposição da Navbar
    },
    contentWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    webContentWrapper: {
        maxWidth: 800,
        width: '99%',
        paddingHorizontal: 0,
    },
    containerLogo: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
        width: '100%',
    },
    logo: {
        width: '80%',
        height: 120,
        resizeMode: 'contain',
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
        padding: 20,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        marginBottom: 20,
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
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 8,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 10,
    },
    navbar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});
