
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, Query } from 'firebase/firestore';
import TaskItem, { Task } from '../../components/TaskItem';
import { useLocalSearchParams, useRouter } from 'expo-router';

type FilterType = 'all' | 'active' | 'completed';
type SortOption = 'newest' | 'oldest' | 'az';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
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
      const tasksCollection = collection(db, 'tasks');
      const baseQuery = [
        where('userId', '==', user.uid),
        where('projectId', '==', selectedProject.id)
      ];
      
      let q: Query;
      if (sortOption === 'newest') {
        q = query(tasksCollection, ...baseQuery, orderBy('createdAt', 'desc'));
      } else if (sortOption === 'oldest') {
        q = query(tasksCollection, ...baseQuery, orderBy('createdAt', 'asc'));
      } else { // 'az'
        q = query(tasksCollection, ...baseQuery, orderBy('title', 'asc'));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(tasksData);
      });
      return unsubscribe;
    } else {
      setTasks([]);
    }
  }, [user, selectedProject, sortOption]);

  useEffect(() => {
    let filtered = tasks;
    if (filter === 'active') {
      filtered = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = tasks.filter(task => task.completed);
    }
    setFilteredTasks(filtered);
  }, [tasks, filter]);

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

      <View style={styles.controlsContainer}>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]} onPress={() => setFilter('all')}>
            <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]} onPress={() => setFilter('active')}>
            <Text style={[styles.filterButtonText, filter === 'active' && styles.filterButtonTextActive]}>Ativas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]} onPress={() => setFilter('completed')}>
            <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>Concluídas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sortContainer}>
          <TouchableOpacity style={[styles.sortButton, sortOption === 'newest' && styles.sortButtonActive]} onPress={() => setSortOption('newest')}>
            <Text style={[styles.sortButtonText, sortOption === 'newest' && styles.sortButtonTextActive]}>Recentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sortButton, sortOption === 'az' && styles.sortButtonActive]} onPress={() => setSortOption('az')}>
            <Text style={[styles.sortButtonText, sortOption === 'az' && styles.sortButtonTextActive]}>A-Z</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggleTask} onDelete={handleDeleteTask} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>{selectedProject ? 'Nenhuma tarefa para este filtro.' : 'Escolha um projeto para ver suas tarefas.'}</Text>}
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
  controlsContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingHorizontal: 10, paddingBottom: 10 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  filterButtonActive: { backgroundColor: '#e0e7ff' },
  filterButtonText: { color: '#475569', fontWeight: '600' },
  filterButtonTextActive: { color: '#2563eb' },
  sortContainer: { flexDirection: 'row', justifyContent: 'center', paddingTop: 5, gap: 10 },
  sortButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f1f5f9' },
  sortButtonActive: { backgroundColor: '#e0e7ff' },
  sortButtonText: { color: '#475569', fontWeight: '500', fontSize: 12 },
  sortButtonTextActive: { color: '#2563eb' },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#64748b' },
  inputContainer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
  input: { flex: 1, height: 50, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 16, fontSize: 16 },
  addButton: { width: 50, height: 50, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
});