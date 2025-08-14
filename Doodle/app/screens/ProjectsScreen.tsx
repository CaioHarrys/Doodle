
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigation, useRouter } from 'expo-router';
import ProjectItem, { Project } from '../../components/ProjectItem';
import AddProjectModal from '../../components/AddProjectModal';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setProjects(projectsData);
      });
      return unsubscribe;
    }
  }, []);

  const handleSelectProject = (project: Project) => {
    router.push({ pathname: '/home', params: { projectId: project.id, projectName: project.name } });
  };

  const handleDeleteProject = async (id: string) => {
    // Lógica para deletar tarefas do projeto seria adicionada aqui
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
  headerButton: { color: '#2563eb', fontSize: 16, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#64748b' },
});