import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../firebase';
import { router } from 'expo-router';
import HelloWave from '@/components/HelloWave';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O _layout irá redirecionar automaticamente.
    } catch (error) {
      Alert.alert('Erro de Login', 'O e-mail ou a senha estão incorretos.');
      if (error instanceof FirebaseError) {
        console.error('Código do erro Firebase:', error.code);
      } else {
        console.error('Erro desconhecido:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <HelloWave/>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <Text style={styles.subtitle}>Faça login para continuar.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#334155', marginBottom: 32 },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    button: { width: '100%', height: 50, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkText: { marginTop: 20, color: '#2563eb', fontWeight: '600' }
});