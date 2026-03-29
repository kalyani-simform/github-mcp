import { useTodo } from '@/context';
import { Priority, TodoStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void;
}

const priorityOptions: Priority[] = ['low', 'medium', 'high'];
const statusOptions: TodoStatus[] = ['pending', 'completed'];
const sortOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Updated Date', value: 'updatedAt' },
  { label: 'Title', value: 'title' },
  { label: 'Priority', value: 'priority' },
];

export function SearchAndFilter({ onSearchChange }: SearchAndFilterProps) {
  const { state, setFilter, clearFilter } = useTodo();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localFilter, setLocalFilter] = useState(state.filter);

  const handleSearchChange = (text: string) => {
    onSearchChange(text);
    setFilter({ search: text || undefined });
  };

  const applyFilter = () => {
    setFilter(localFilter);
    setShowFilterModal(false);
  };

  const resetFilter = () => {
    const clearedFilter = {
      search: state.filter.search,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };
    setLocalFilter(clearedFilter);
    clearFilter();
    if (state.filter.search) {
      setFilter({ search: state.filter.search });
    }
    setShowFilterModal(false);
  };

  const hasActiveFilters = Boolean(
    state.filter.status ||
    state.filter.priority ||
    state.filter.category ||
    state.filter.sortBy !== 'createdAt' ||
    state.filter.sortOrder !== 'desc',
  );

  const getUniqueCategories = (): string[] => {
    const categories = state.todos
      .map((todo) => todo.category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(categories)];
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search todos..."
          value={state.filter.search || ''}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons
            name="funnel"
            size={20}
            color={hasActiveFilters ? '#fff' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={resetFilter} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !localFilter.status && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setLocalFilter({ ...localFilter, status: undefined })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      !localFilter.status && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.option,
                      localFilter.status === status && styles.optionSelected,
                    ]}
                    onPress={() => setLocalFilter({ ...localFilter, status })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilter.status === status &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {status === 'pending' ? 'Pending' : 'Completed'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !localFilter.priority && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setLocalFilter({ ...localFilter, priority: undefined })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      !localFilter.priority && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {priorityOptions.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.option,
                      localFilter.priority === priority &&
                        styles.optionSelected,
                    ]}
                    onPress={() => setLocalFilter({ ...localFilter, priority })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilter.priority === priority &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {getUniqueCategories().length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Category</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      !localFilter.category && styles.optionSelected,
                    ]}
                    onPress={() =>
                      setLocalFilter({ ...localFilter, category: undefined })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        !localFilter.category && styles.optionTextSelected,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                  {getUniqueCategories().map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.option,
                        localFilter.category === category &&
                          styles.optionSelected,
                      ]}
                      onPress={() =>
                        setLocalFilter({ ...localFilter, category })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          localFilter.category === category &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      localFilter.sortBy === option.value &&
                        styles.optionSelected,
                    ]}
                    onPress={() =>
                      setLocalFilter({
                        ...localFilter,
                        sortBy: option.value as any,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localFilter.sortBy === option.value &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort Order</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    localFilter.sortOrder === 'desc' && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setLocalFilter({ ...localFilter, sortOrder: 'desc' })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilter.sortOrder === 'desc' &&
                        styles.optionTextSelected,
                    ]}
                  >
                    Newest First
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.option,
                    localFilter.sortOrder === 'asc' && styles.optionSelected,
                  ]}
                  onPress={() =>
                    setLocalFilter({ ...localFilter, sortOrder: 'asc' })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilter.sortOrder === 'asc' &&
                        styles.optionTextSelected,
                    ]}
                  >
                    Oldest First
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  filterButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
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
  modalCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#4ECDC4',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionSelected: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  modalActions: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});
