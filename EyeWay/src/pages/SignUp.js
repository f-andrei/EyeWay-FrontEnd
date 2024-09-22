import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, SafeAreaView, Platform, Button, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useStore } from '../store/globalStore';

export default function Login({ navigation }) {
    const { setAuthenticated  } = useStore();

    function login(){
        setAuthenticated(true);
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
            Crie sua Conta 
        </Text>
      </View>
      
      <View style={estilos.card}>
      <Text style={estilos.textInput}>
            Nome:
        </Text>

        <TextInput style={estilos.input} placeholder='João'placeholderTextColor="#6c757d"></TextInput>

        <Text style={estilos.textInput}>
            Email:
        </Text>

        <TextInput style={estilos.input} placeholder='user@email.com'placeholderTextColor="#6c757d"></TextInput>

        <Text style={estilos.textInput}>
            Senha:
        </Text>

        <TextInput style={estilos.input} placeholder='senha1Forte@12' placeholderTextColor="#6c757d"></TextInput>

        <TouchableOpacity >
        <Text style={estilos.buttonStyle}>Cadastrar</Text>
        </TouchableOpacity>


      </View>
        <Text style={estilos.footer}>Copyright © 2024 EyeWay Inc. Todos os direitos reservados. EyeWay Inc. Brasil Ltda. CNPJ: 33.777.999/0000-09</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
    alignItems: 'center',
    paddingVertical: 40,
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  containerTexto: {
    alignContent: 'center',
  },
  textColor:{
    fontSize: 25,
    color: '#6AA3A7',
  },
  textInput:{
    marginTop:20,
    fontSize: 14,
    color: '#6AA3A7',
  },
  input:{
    marginTop: 5,
    borderRadius: 5,
    minWidth: 50,
    minHeight: 10,
    borderColor: '#343a40',
    color: '#fff',
    borderWidth: 2,
    padding: 5,
    
  },
  card:{
    backgroundColor: '#202020',
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    minWidth: 350,
    minHeight: 350,
  },
  buttonStyle: {
    backgroundColor: '#FF9C11',
    borderRadius: 5,
    textColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    width: 'fit-content'
  },
  footer:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#C26015',
    padding: 5,

  },
});
