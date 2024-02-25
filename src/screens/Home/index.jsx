import React, { useState, useEffect } from 'react';
import { View, StatusBar, TextInput, Button, Pressable, Text, FlatList, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTodoId, setEditTodoId] = useState('');
  const [editedTodoText, setEditedTodoText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get todolist data function
  const loadTodos = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if (value !== null) {
        setTodos(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadTodos();
  }, []);

  // Add todolist data function
  const addTodo = async () => {
    if (newTodo.trim()) {
      const updatedTodos = [...todos, { id: Math.random().toString(), text: newTodo }];
      setTodos(updatedTodos);
      setNewTodo('');
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  // Edit todolist data function
  const editTodo = (id, text) => {
    setEditModalVisible(true);
    setEditTodoId(id);
    setEditedTodoText(text);
  };

  const updateTodo = async () => {
    const updatedTodos = todos.map(todo =>
      todo.id === editTodoId ? { ...todo, text: editedTodoText } : todo
    );
    setTodos(updatedTodos);
    await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    setEditModalVisible(false);
  };

  // Delete todolist data function
  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <StatusBar backgroundColor='#fff' />
     {/* Add Todos */}
      <View style={styles.addTodoContainer}>
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="New Todo"
          style={styles.input}
        />
        <Pressable onPress={addTodo} style={styles.addBtn}>
          <Icon name='plus' />
        </Pressable>
      </View>
      {/* Search Bar*/}
      <View style={styles.searchContainer}>
        <Icon name='search1' />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Todos"
          style={styles.search}
        />
      </View>
      {/* Show todos data */}
    {filteredTodos.length !== 0 ? (
        <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.showTodosContainer}>
            <Text style={styles.renderText}>{item.text}</Text>
            <Pressable onPress={() => deleteTodo(item.id)} style={[styles.updateDeleteBtn, { backgroundColor: 'red' }]}>
              <Icon name='delete' color='white' />
            </Pressable>
            <Pressable onPress={() => editTodo(item.id, item.text)} style={[styles.updateDeleteBtn, { backgroundColor: '#4ca746', marginHorizontal: 5 }]}>
              <Icon name='edit' color='white' />
            </Pressable>
          </View>
        )}
      />
    ): (
        <Text style={{textAlign: 'center'}} > Data Not Found!</Text>
    )}
      
      {/* Edit todos modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 50, borderRadius: 10, width: '90%' }}>
            <TextInput
              value={editedTodoText}
              onChangeText={setEditedTodoText}
              placeholder="Edit Todo"
              style={styles.updateInput}
            />
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Button title="Update" onPress={updateTodo} />
              <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#5e86ff',
    width: '90%',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#5e86ff',
    width: '75%',
    margin: 20,
    padding: 10,
    borderRadius: 5
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    width: 50,
    height: 50,
    padding: 10,
    borderRadius: 100
  },
  showTodosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderText: {
    fontSize: 16,
    width: '65%',
    margin: 20
  },
  updateDeleteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 100
  },
  updateInput: {
    marginVertical: 20,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    color: 'black'
  }
})

export default Home;
