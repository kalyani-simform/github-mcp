import { useTodo } from '@/context';
import { Priority, TodoFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddTodoFormProps {
  visible: boolean;
  onClose: () => void;
}

const priorityOptions: { label: string; value: Priority; color: string }[] = [
  { label: 'Low', value: 'low', color: '#4ECDC4' },
  { label: 'Medium', value: 'medium', color: '#FFB347' },
  { label: 'High', value: 'high', color: '#FF6B6B' },
];

export function AddTodoForm({ visible, onClose }: AddTodoFormProps) {
  const { addTodo, state } = useTodo();
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addTodo({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        priority: formData.priority,
        category: formData.category?.trim() || undefined,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
      });
      setErrors({});
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
    });
    setErrors({});
    onClose();
  };

  if (state.error) {
    Alert.alert('Error', state.error);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Todo</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="What needs to be done?"
              maxLength={100}
              autoFocus
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
            <Text style={styles.characterCount}>
              {formData.title.length}/100
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Add more details..."
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
            <Text style={styles.characterCount}>
              {(formData.description || '').length}/500
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityOption,
                    formData.priority === option.value &&
                      styles.priorityOptionSelected,
                    { borderColor: option.color },
                    formData.priority === option.value && {
                      backgroundColor: option.color,
                    },
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, priority: option.value })
                  }
                >
                  <Text
                    style={[
                      styles.priorityText,
                      formData.priority === option.value &&
                        styles.priorityTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) =>
                setFormData({ ...formData, category: text })
              }
              placeholder="e.g., Work, Personal, Shopping..."
              maxLength={50}
            />
            <Text style={styles.characterCount}>
              {(formData.category || '').length}/50
            </Text>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityOptionSelected: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priorityTextSelected: {
    color: '#fff',
  },
  spacer: {
    height: 40,
  },
});
