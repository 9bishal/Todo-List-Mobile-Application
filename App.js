import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Switch,
  Dimensions,
  ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedTime, setEditedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  
  // For scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // ➕ Add new task
  const addTask = () => {
    if (newTask.trim() === "") return;

    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      taskTime: taskTime,
      alertShown: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  // ⏰ Calculate remaining time
  const getRemainingTime = (taskTime) => {
    const now = new Date();
    const diff = taskTime - now;
    if (diff <= 0) return "Time's up!";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Snooze task for 5 minutes
  const snoozeTask = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newTime = new Date(task.taskTime);
        newTime.setMinutes(newTime.getMinutes() + 5);
        return { ...task, taskTime: newTime, alertShown: false };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // ⏱️ Countdown & alert when time's up
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTasks = [...tasks];

      updatedTasks.forEach((task) => {
        if (task.taskTime <= now && !task.completed && !task.alertShown) {
          task.alertShown = true;

          Alert.alert(
            "Time's up ⏰",
            `Task: ${task.text}`,
            [
              {
                text: "Mark as completed ✅",
                onPress: () => {
                  const completedTasks = tasks.map(t =>
                    t.id === task.id ? { ...t, completed: true } : t
                  );
                  setTasks(completedTasks);
                },
              },
              {
                text: "Snooze (5 min) ⏸️",
                onPress: () => snoozeTask(task.id)
              },
            ]
          );
        }
      });

      setTasks(updatedTasks);
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > 50 && isHeaderVisible) {
          setIsHeaderVisible(false);
        } else if (currentScrollY <= 50 && !isHeaderVisible) {
          setIsHeaderVisible(true);
        }
      },
      useNativeDriver: false
    }
  );

  // Filter tasks based on completion status
  const filteredTasks = showCompletedOnly 
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => !task.completed);

  // Animated header style
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[
        styles.header,
        { transform: [{ translateY: headerTranslate }] }
      ]}>
        <Text style={styles.title}>My Todo List 📝</Text>
        <Text style={styles.subtitle}>Stay organized and productive</Text>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        {/* Input + Time Picker + Add */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter a task..."
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="time-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addTask}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={taskTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                setShowPicker(false);
                if (selectedTime) setTaskTime(selectedTime);
              }}
            />
          )}

          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              {showCompletedOnly ? "Showing completed tasks" : "Showing active tasks"}
            </Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Completed</Text>
              <Switch
                value={showCompletedOnly}
                onValueChange={setShowCompletedOnly}
                trackColor={{ false: "#767577", true: "#4CD964" }}
              />
            </View>
          </View>
        </View>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name={showCompletedOnly ? "checkmark-done-circle" : "list-circle"} 
              size={64} 
              color="#ccc" 
            />
            <Text style={styles.emptyStateText}>
              {showCompletedOnly 
                ? "No tasks completed yet!" 
                : "No active tasks! Add one above."}
            </Text>
          </View>
        ) : (
          <View style={styles.taskListContainer}>
            {filteredTasks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.taskItem,
                  item.completed && styles.taskCompleted
                ]}
                onPress={() => toggleCompletion(item.id)}
                onLongPress={() => {
                  setSelectedTask(item);
                  setEditedText(item.text);
                  setEditedTime(item.taskTime);
                  setModalVisible(true);
                }}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskCheckbox}>
                    {item.completed ? (
                      <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={24} color="#ccc" />
                    )}
                  </View>
                  <View style={styles.taskDetails}>
                    <Text
                      style={[
                        styles.taskText,
                        item.completed && styles.taskTextCompleted
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text style={styles.taskTime}>
                      ⏰ {getRemainingTime(item.taskTime)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTask(item);
                      setEditedText(item.text);
                      setEditedTime(item.taskTime);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Extra space at the bottom for better scrolling */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Add Button (appears when scrolling) */}
      <Animated.View style={[
        styles.floatingAddButton,
        { 
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          })
        }
      ]}>
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={addTask}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Edit/Delete Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>

              <TextInput
                style={styles.modalInput}
                value={editedText}
                onChangeText={setEditedText}
                multiline={true}
              />

              <TouchableOpacity 
                style={styles.timeButtonModal}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeButtonText}>
                  ⏰ Edit Time: {editedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={editedTime}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selected) => {
                    setShowTimePicker(false);
                    if (selected) setEditedTime(selected);
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    const updatedTasks = tasks.map((task) =>
                      task.id === selectedTask.id
                        ? { ...task, text: editedText, taskTime: editedTime, alertShown: false }
                        : task
                    );
                    setTasks(updatedTasks);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => {
                    const updatedTasks = tasks.filter(
                      (task) => task.id !== selectedTask.id
                    );
                    setTasks(updatedTasks);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 140, // Extra space for animated header
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#f8f9fa",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#2c3e50" 
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: { 
    flexDirection: "row", 
    marginBottom: 15, 
    alignItems: "center" 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 10, 
    padding: 15, 
    marginRight: 10, 
    backgroundColor: "white",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  filterText: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    color: "#7f8c8d",
  },
  taskListContainer: {
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskCompleted: {
    opacity: 0.7,
    backgroundColor: "#f8f9fa",
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    marginRight: 15,
  },
  taskDetails: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 5,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#95a5a6",
  },
  taskTime: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    minHeight: height * 0.4,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#bdc3c7",
    marginTop: 20,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 20,
  },
  floatingButton: {
    backgroundColor: "#2ecc71",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#2c3e50",
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  timeButtonModal: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});