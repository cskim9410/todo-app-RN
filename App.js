// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";

export default function App() {
  const [working, setWorking] = useState(true);
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const saveTodos = async (text) => {
    const randomId = Math.random().toString();
    storeData({
      ...todos,
      [randomId]: {
        text: text,
        isDone: false,
        type: working ? true : false,
      },
    });
    const data = await getData();
    setTodos(data);
  };
  const deleteTodo = (id) => {
    const newTodo = { ...todos };
    delete newTodo[id];
    storeData(newTodo);
    setTodos(newTodo);
  };
  const finishTodo = (id) => {
    const newTodo = { ...todos };
    newTodo[id].isDone = !newTodo[id].isDone;
    storeData(newTodo);
    setTodos(newTodo);
  };
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("todos", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("todos");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    async function init() {
      const storedTodo = await getData();
      setTodos(storedTodo);
    }
    init();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btn, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btn, color: !working ? "white" : theme.grey }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={({ nativeEvent: { text } }) => {
          setInputText("");
          saveTodos(text);
        }}
        onChangeText={(event) => setInputText(event)}
        placeholder={working ? "Add a To Do" : "Where do you want to go"}
        style={styles.input}
        value={inputText}
      />
      <ScrollView>
        <View style={styles.list}>
          {todos !== null &&
            Object.keys(todos).map((id) => {
              return todos[id].type === working ? (
                <TouchableOpacity
                  onLongPress={() => deleteTodo(id)}
                  onPress={() => finishTodo(id)}
                  key={id}
                  style={{
                    ...styles.todo,
                    backgroundColor: todos[id].isDone ? "teal" : "white",
                  }}
                >
                  <Text style={styles.todoText}>{todos[id].text}</Text>
                </TouchableOpacity>
              ) : null;
            })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 50,
  },
  btn: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  list: {
    borderWidth: 5,
    borderRadius: 30,
    marginHorizontal: 10,
    borderColor: "purple",
    marginTop: 30,
    alignItems: "center",
  },
  todo: {
    paddingVertical: 20,
    marginVertical: 10,
    width: "85%",
  },
  todoText: {
    textAlign: "center",
  },
});
