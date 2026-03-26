import { useTodo } from '@/context';
import { Todo } from '@/types';
import { formatDate, getPriorityColor } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || '',
  );

  const handleToggleComplete = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTodo(todo.id),
      },
    ]);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim()) {
      await updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const priorityColor = getPriorityColor(todo.priority);

  if (isEditing) {
    return (
      <View style={styles.container}>
        <View
          style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}
        />
        <View style={styles.content}>
          <TextInput
            style={styles.editInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Todo title"
            autoFocus
          />
          <TextInput
            style={[styles.editInput, styles.descriptionInput]}
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Description (optional)"
            multiline
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Ionicons name="close" size={16} color="#666" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, todo.completed && styles.completedContainer]}
    >
      <View
        style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleToggleComplete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.checkbox, todo.completed && styles.checkedBox]}>
          {todo.completed && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, todo.completed && styles.completedTitle]}>
          {todo.title}
        </Text>

        {todo.description && (
          <Text
            style={[
              styles.description,
              todo.completed && styles.completedDescription,
            ]}
          >
            {todo.description}
          </Text>
        )}

        <View style={styles.metadata}>
          <View style={styles.metadataLeft}>
            <View style={styles.priorityBadge}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {todo.priority.toUpperCase()}
              </Text>
            </View>
            {todo.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{todo.category}</Text>
              </View>
            )}
          </View>

          <Text style={styles.dateText}>{formatDate(todo.createdAt)}</Text>
        </View>

        {todo.dueDate && (
          <View style={styles.dueDateContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text
              style={[
                styles.dueDateText,
                new Date(todo.dueDate) < new Date() &&
                  !todo.completed &&
                  styles.overdueDateText,
              ]}
            >
              Due: {todo.dueDate.toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="pencil" size={18} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedDescription: {
    color: '#aaa',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#e3f2fd',
  },
  categoryText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  overdueDateText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    marginLeft: 4,
  },
});
