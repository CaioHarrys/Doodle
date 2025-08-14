
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import TaskItem, { Task } from '../../components/TaskItem';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Observador do estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Observador das tarefas no Firestore (Read em tempo real)
  useEffect(() => {
    if (user) {
      const tasksCollection = collection(db, 'tasks');
      // Ordena as tarefas pela data de criação, da mais nova para a mais antiga
      const q = query(tasksCollection, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasksData.push({ id: doc.id, title: data.title, completed: data.completed });
        });
        setTasks(tasksData);
      });

      return unsubscribe; // Limpa o listener ao desmontar
    }
  }, [user]);

  // Função para adicionar uma nova tarefa (Create)
  const handleAddTask = async () => {
    if (newTask.trim() === '' || !user) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask,
        completed: false,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setNewTask('');
    } catch (error) {
      console.error("Erro ao adicionar tarefa: ", error);
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Função para marcar/desmarcar tarefa (Update)
  const handleToggleTask = async (id: string) => {
    const taskRef = doc(db, 'tasks', id);
    const taskToUpdate = tasks.find(task => task.id === id);
    if (taskToUpdate) {
      await updateDoc(taskRef, {
        completed: !taskToUpdate.completed
      });
    }
  };

  // Função para deletar uma tarefa (Delete)
  const handleDeleteTask = async (id: string) => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  };

  // Função de Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Tarefas</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa ainda. Adicione uma!</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#64748b',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
