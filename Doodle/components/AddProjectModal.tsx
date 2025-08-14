
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ visible, onClose }: Props) {
  const [projectName, setProjectName] = useState('');

  const handleAddProject = async () => {
    if (projectName.trim() === '' || !auth.currentUser) return;
    try {
      await addDoc(collection(db, 'projects'), {
        name: projectName,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
      });
      setProjectName('');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o projeto.');
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Projeto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do projeto"
            value={projectName}
            onChangeText={setProjectName}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleAddProject}>
              <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#64748b' },
  createButton: { backgroundColor: '#2563eb' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});