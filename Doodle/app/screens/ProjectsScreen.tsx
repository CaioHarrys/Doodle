
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy, Query } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigation, useRouter } from 'expo-router';
import ProjectItem, { Project } from '../../components/ProjectItem';
import AddProjectModal from '../../components/AddProjectModal';

type SortOption = 'newest' | 'oldest' | 'az';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      const projectsCollection = collection(db, 'projects');
      const baseQuery = where('userId', '==', auth.currentUser.uid);
      
      let q: Query;
      if (sortOption === 'newest') {
        q = query(projectsCollection, baseQuery, orderBy('createdAt', 'desc'));
      } else if (sortOption === 'oldest') {
        q = query(projectsCollection, baseQuery, orderBy('createdAt', 'asc'));
      } else { // 'az'
        q = query(projectsCollection, baseQuery, orderBy('name', 'asc'));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setProjects(projectsData);
      });
      return unsubscribe;
    }
  }, [sortOption]);

  const handleSelectProject = (project: Project) => {
    router.push({ pathname: '/home', params: { projectId: project.id, projectName: project.name } });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.headerButton}>Adicionar</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity style={[styles.sortButton, sortOption === 'newest' && styles.sortButtonActive]} onPress={() => setSortOption('newest')}>
          <Text style={[styles.sortButtonText, sortOption === 'newest' && styles.sortButtonTextActive]}>Recentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortButton, sortOption === 'oldest' && styles.sortButtonActive]} onPress={() => setSortOption('oldest')}>
          <Text style={[styles.sortButtonText, sortOption === 'oldest' && styles.sortButtonTextActive]}>Antigos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortButton, sortOption === 'az' && styles.sortButtonActive]} onPress={() => setSortOption('az')}>
          <Text style={[styles.sortButtonText, sortOption === 'az' && styles.sortButtonTextActive]}>A-Z</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectItem project={item} onSelect={handleSelectProject} onDelete={handleDeleteProject} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum projeto encontrado.</Text>}
      />
      <AddProjectModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerButton: { color: '#2563eb', fontSize: 16, fontWeight: '600', marginRight: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#64748b' },
  sortContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 10 },
  sortButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f1f5f9' },
  sortButtonActive: { backgroundColor: '#e0e7ff' },
  sortButtonText: { color: '#475569', fontWeight: '600' },
  sortButtonTextActive: { color: '#2563eb' },
});