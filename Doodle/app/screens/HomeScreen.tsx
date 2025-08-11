// Descrição: Tela principal (sem alterações de lógica).

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O _layout irá redirecionar automaticamente.
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Tarefas</Text>
      <Text style={styles.welcome}>Bem-vindo ao Doodle!</Text>
      <Text style={styles.info}>Aqui ficarão suas tarefas. (Etapa 3)</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 8 },
    welcome: { fontSize: 18, color: '#334155', marginBottom: 20 },
    info: { fontSize: 16, color: '#64748b', marginBottom: 40 },
    button: { width: '100%', height: 50, backgroundColor: '#ef4444', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});