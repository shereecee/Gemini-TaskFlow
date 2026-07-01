import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, Pressable, StyleSheet } from 'react-native';

export default function AddTaskModal({ visible, onClose, onSubmit }) {
  const [text, setText] = useState('');

  function handleSubmit() {
    if (text.trim() === '') return;
    onSubmit(text);
    setText(''); // Clean text space
  }

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent 
      onRequestClose={onClose}
    >
      {/* Outer Pressable acting as the blur backdrop overlay click catch */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable catches pointer propagation to protect card interactions */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.modalTitle}>New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Task Description..."
            placeholderTextColor="#A0AAB8"
            value={text}
            onChangeText={setText}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Dark slate overlay blur tint
    justifyContent: 'center',
    padding: 24,
  },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 8,
    paddingHorizontal: 16, 
    height: 50,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12 
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  cancelText: { 
    color: '#64748B', 
    fontWeight: '600',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#2E5BBA', 
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { 
    color: '#FFF', 
    fontWeight: '600',
    fontSize: 15,
  },
});