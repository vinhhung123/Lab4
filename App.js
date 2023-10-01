import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, List } from 'react-native-paper'; // Thêm import List từ react-native-paper
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsgsaBcOWtzsnY0NmnJstkvuwPU_Ux8-4",
  authDomain: "ktgk-6f8fc.firebaseapp.com",
  projectId: "ktgk-6f8fc",
  storageBucket: "ktgk-6f8fc.appspot.com",
  messagingSenderId: "569642671418",
  appId: "1:569642671418:web:e0dfc7a065201418b90403",
  measurementId: "G-D38CXXK6F5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

const App = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const todoCollection = collection(firestore, 'todos');
      const unsubscribe = onSnapshot(todoCollection, (querySnapshot) => {
        const dataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data(); // Lấy dữ liệu của mục từ Firestore
          dataArray.push({ id: doc.id, ...data }); // Đưa vào mảng dữ liệu
        });
        setData(dataArray);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddData = async () => {
    if (text) {
      const todoCollection = collection(firestore, 'todos');
      try {
        await addDoc(todoCollection, { text, complete: true });
        setText('');
      } catch (error) {
        console.error('Lỗi khi thêm dữ liệu vào Firestore:', error);
      }
    }
  };
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#000000' }}>
          <Appbar.Content title={'TODOs List'} color='red' />
        </Appbar.Header>
        <FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={({ item }) => (
            <List.Item
              title={item.text}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={item.complete ? 'check' : 'cancel'}
                />
              )}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <TextInput
          placeholder={'New Todo'}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button title="Thêm TODO" onPress={handleAddData} />
      </View>
    </SafeAreaProvider>
  );
};

export default App;