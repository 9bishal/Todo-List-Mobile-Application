# Todo List App 📝

A beautiful and functional React Native Todo List application with time-based alerts, task management, and smooth animations.
![React Native](https://img.shields.io/badge/React_Native-0.71.8-blue) ![Expo](https://img.shields.io/badge/Expo-Managed%20Workflow-lightgrey) ![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

## Features ✨

- ✅ **Add tasks** with custom descriptions
- ⏰ **Set time reminders** for each task
- 🔔 **Time-based alerts** when tasks are due
- ⏸️ **Snooze functionality** (5-minute increments)
- 🎯 **Mark tasks as completed** with visual indicators
- 🔍 **Filter tasks** (show all, active only, or completed only)
- ✏️ **Edit tasks** with long-press or edit button
- 🗑️ **Delete tasks** easily
- 🎨 **Beautiful UI** with smooth animations
- 📱 **Responsive design** works on iOS and Android
- 🔄 **Scroll interactions** with animated header

## Screenshots 📸

*(App preview would be shown here)*

## Installation 🛠️

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## Usage 🚀

### Adding a Task
1. Type your task in the input field
2. Tap the time button ⏰ to set a reminder
3. Press the add button ➕ to create the task

### Managing Tasks
- **Tap a task** to mark it as completed/incomplete
- **Long press a task** to edit or delete it
- **Use the toggle switch** to filter completed tasks
- **Swipe to scroll** through your tasks

### Time Alerts
- When a task's time is up, you'll get an alert
- Choose to **mark as completed** ✅ or **snooze** ⏸️ for 5 minutes

## Technology Stack 💻

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **JavaScript** - Programming language
- **JSX** - UI markup syntax
- **CSS-like Styles** - Styling components
- **React Hooks** (useState, useEffect, useRef) - State management
- **Animated API** - Smooth animations
- **DateTimePicker** - Time selection component

## File Structure 📁

```
todo-app/
├── App.js                 # Main application component
├── package.json           # Dependencies and scripts
├── assets/               # Images and other assets
└── README.md             # This file
```

## Dependencies 📦

```json
{
  "@react-native-community/datetimepicker": "^8.4.5",
  "expo": "~54.0.7",
  "expo-notifications": "~0.32.11",
  "expo-status-bar": "~3.0.8",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-native": "0.81.4",
  "react-native-web": "~0.21.0"
}
```

## Customization 🎨

You can customize the app by modifying:

- **Colors**: Change the color scheme in the `styles` object
- **Animations**: Adjust animation parameters in the `Animated` components
- **Time formats**: Modify the time display in `getRemainingTime()`
- **Snooze duration**: Change the 5-minute snooze in `snoozeTask()`

## Troubleshooting 🔧

### Common Issues

1. **"react-native-web" not installed**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **App not starting**
   ```bash
   npm start -- --clear
   ```

3. **DateTimePicker not working on Android**
   - Make sure you're using a compatible version of React Native

## Contributing 🤝

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Learning Resources 📚

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.io/)
- [JavaScript ES6+ Features](https://javascript.info/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

## Future Enhancements 🚀

- [ ] Backend integration for data persistence
- [ ] Push notifications for time alerts
- [ ] Task categories and tags
- [ ] Dark mode support
- [ ] Task sharing functionality
- [ ] Voice input for adding tasks
- [ ] Weekly/Monthly task views

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Support 💬

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy task managing!** 🎉
