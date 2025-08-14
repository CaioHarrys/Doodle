
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface Project {
  id: string;
  name: string;
}

interface Props {
  project: Project;
  onSelect: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectItem({ project, onSelect, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(project)}>
      <Text style={styles.name}>{project.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(project.id)}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  name: { fontSize: 18 },
  deleteButton: { padding: 5 },
  deleteButtonText: { fontSize: 18, color: '#ef4444' },
});