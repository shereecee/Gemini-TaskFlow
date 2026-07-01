import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

// Core State/Database Link
import { supabase } from '../../lib/supabase';

// Visual Presentation Components
import TaskItem from '../../components/TaskItem';
import AddTaskModal from '../../components/AddTaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  // 5.2 Read — Fetch items from backend
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Toast.show({ type: 'error', text1: 'Connection Failed', text2: error.message });
      return;
    }
    setTasks(data || []);
  }

  // 7.4 Create — Controlled execution loop called by Modal submission
  async function handleSubmitTask(title) {
    const { error } = await supabase
      .from('tasks')
      .insert([{ title: title, completed: false }]);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not add task', text2: error.message });
      return;
    }

    setModalVisible(false); // Close Modal context window
    loadTasks();           // Reload view cache
    Toast.show({ type: 'success', text1: 'Task added successfully! ✨' });
  }

  // 5.4 Update — Flip Task Completion Data Bound Matrix rows
  async function toggleTask(item) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Failed to update task state' });
      return;
    }
    loadTasks();
  }

  // 5.5 Delete — Wipe entries out of database records
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Could not drop row context' });
      return;
    }
    loadTasks();
    Toast.show({ type: 'success', text1: 'Task dropped safely.' });
  }

  return (
    <View style={styles.container}>
      {/* Top App Header Section Layout Row */}
      <View style={headerStyles.headerRow}>
        <Text style={headerStyles.headerTitle}>TaskFlow</Text>
        <View style={headerStyles.actions}>
          <TouchableOpacity style={headerStyles.cameraButton} onPress={() => router.push('/camera')}>
            <MaterialIcons name="photo-camera" size={22} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.openButton} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="add-task" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Render optimized dynamic lists */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      />

      {/* Embedded Action Overlay Subtree Sheet */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  openButton: {
    backgroundColor: '#2E5BBA',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cameraButton: {
    backgroundColor: '#FFFFFF',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  }
});