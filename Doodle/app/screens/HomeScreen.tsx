
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import TaskItem, { Task } from '../../components/TaskItem';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams<{ projectId?: string; projectName?: string }>();
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (params.projectId && params.projectName) {
      setSelectedProject({ id: params.projectId, name: params.projectName });
    }
  }, [params.projectId, params.projectName]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && selectedProject) {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        where('projectId', '==', selectedProject.id),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(tasksData);
      });
      return unsubscribe;
    } else {
      setTasks([]);
    }
  }, [user, selectedProject]);

  const handleAddTask = async () => {
    if (newTask.trim() === '' || !user || !selectedProject) return;
    await addDoc(collection(db, 'tasks'), {
      title: newTask,
      completed: false,
      createdAt: serverTimestamp(),
      userId: user.uid,
      projectId: selectedProject.id,
    });
    setNewTask('');
  };

  const handleToggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (taskToUpdate) await updateDoc(doc(db, 'tasks', id), { completed: !taskToUpdate.completed });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{selectedProject ? selectedProject.name : 'Selecione um Projeto'}</Text>
          <TouchableOpacity onPress={() => router.push('/projects')}>
            <Text style={styles.changeProjectText}>Trocar Projeto</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout}><Text style={styles.logoutText}>Sair</Text></TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggleTask} onDelete={handleDeleteTask} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>{selectedProject ? 'Nenhuma tarefa neste projeto.' : 'Escolha um projeto para ver suas tarefas.'}</Text>}
      />
      {selectedProject && (
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Adicionar nova tarefa..." value={newTask} onChangeText={setNewTask} />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}><Text style={styles.addButtonText}>+</Text></TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a' },
  changeProjectText: { color: '#2563eb', fontWeight: '600', marginTop: 4 },
  logoutText: { fontSize: 16, color: '#ef4444', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#64748b' },
  inputContainer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
  input: { flex: 1, height: 50, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 16, fontSize: 16 },
  addButton: { width: 50, height: 50, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
});