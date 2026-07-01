import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={20}
          color={item.completed ? '#2E5BBA' : '#5A6472'}
        />
        <Text style={[styles.taskText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  }
});