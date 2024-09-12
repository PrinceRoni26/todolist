import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error(error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = () => {
    if (task.trim() === '') return;
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTask('');
  };

  const updateTask = () => {
    if (editingTask.trim() === '') return;
    const newTasks = [...tasks];
    newTasks[editingIndex] = editingTask;
    setTasks(newTasks);
    saveTasks(newTasks);
    setEditingIndex(null);
    setEditingTask('');
  };

  const removeTask = (index) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
            saveTasks(newTasks);
          },
        },
      ]
    );
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingTask(tasks[index]);
  };

  const filteredTasks = tasks.filter(task => task.toLowerCase().includes(search.toLowerCase()));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>To-Do List</Text>
      </View>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search tasks"
        placeholderTextColor="#888"
      />
      {editingIndex !== null ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editingTask}
            onChangeText={setEditingTask}
            placeholder="Edit task"
            placeholderTextColor="#888"
          />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={updateTask} color="#4CAF50" />
            <Button title="Cancel" onPress={() => setEditingIndex(null)} color="#F44336" />
          </View>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={task}
            onChangeText={setTask}
            placeholder="Add a new task"
            placeholderTextColor="#888"
          />
          <Button title="Add Task" onPress={addTask} color="#2196F3" />
        </>
      )}
      <FlatList
        data={filteredTasks}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.task}>{item}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => startEditing(index)} style={styles.editButton}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeTask(index)} style={styles.deleteButton}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 30, // Adjusted marginTop to lower the header
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  search: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  editContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  task: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 15,
  },
  edit: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteButton: {},
  delete: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default App;
