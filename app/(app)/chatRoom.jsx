import { View, Text, StatusBar, TextInput, TouchableOpacity, Alert, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ChatRoomHeader from '../components/ChatRoomHeader';
import MessageList from '../components/MessageList';
import { Image } from 'expo-image';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getRoomId, blurhash } from '../../utils/common';

const MessageItem = ({ message, isSender, showUserImage }) => {
  const messageDate = new Date(message.createdAt.toDate());
  
  // Get time in 12-hour format with AM/PM
  const formattedTime = messageDate.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });

  return (
    <View className={`flex-row ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isSender && showUserImage && (
        <Image
          source={message.profileUrl}
          className="w-8 h-8 rounded-full mr-2"
          placeholder={blurhash}
          transition={500}
        />
      )}
      <View 
        className={`
          ${isSender ? 'bg-blue-500' : 'bg-gray-100'} 
          px-4 py-2
          rounded-full
          ${isSender ? 'mr-4' : 'ml-4'}
          max-w-[75%]
        `}
      >
        <View className="flex-row items-center justify-between gap-4">
          <Text 
            className={`${isSender ? 'text-white' : 'text-gray-800'} text-[17px]`}
            style={{ lineHeight: 24 }}
          >
            {message.text}
          </Text>
          <Text 
            className={`
              ${isSender ? 'text-white' : 'text-gray-500'} 
              text-[8px] opacity-60 whitespace-nowrap
            `}
          >
            {formattedTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function ChatRoom() {
    const item = useLocalSearchParams();
    const router = useRouter();
    const {user} = useAuth()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const textRef = useRef();
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExists();

        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapShot)=> {
            let allMessages = snapShot.docs.map(doc => {
                return doc.data();
            })
            setMessages([...allMessages]);
        });

         const KeyBoardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
         )
        
       return ()=>{
        unsub();
        KeyBoardDidShowListener.remove();
       }
    }, []);

    useEffect(()=> {
        updateScrollView();
    }, [messages])

    const updateScrollView = () => {
        setTimeout(()=> {
            scrollViewRef?.current?.scrollToEnd({animated: true});
        }, 100)
    }
 
    const createRoomIfNotExists = async () => {
        // roomId
        let roomId = getRoomId(user?.userId, item?.userId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        }
    )}

    const handleSendMessage = async () => {
        let messageText = message.trim();
        if(!messageText) return;

        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, "rooms", roomId);
            const messagesRef = collection(docRef, "messages");
            setMessage('');
            
            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text: messageText,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });

            console.log('new message Id :', newDoc.id);
        } catch(err) {
            Alert.alert("message", err.message);
        }
    }

    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach(message => {
            const date = new Date(message.createdAt.toDate()).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    // console.log('get all msgs :', messages);
  return (
    <View className="flex-1 bg-white">
      <ChatRoomHeader user={item} router={router} />
      
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-2 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
          <View key={date}>
            <View className="flex-1 items-center justify-between my-3">
              <Text className="text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full">
                {date}
              </Text>
            </View>
            {dateMessages.map((msg, index) => (
              <MessageItem 
                key={index}
                message={msg}
                isSender={msg.userId === user.userId}
                showUserImage={
                  index === 0 || 
                  dateMessages[index - 1]?.userId !== msg.userId
                }
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="p-4 border-t border-gray-100">
        <View className="flex-row items-center space-x-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-1">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
              className="flex-1 text-base text-gray-700 mr-2"
              style={{ maxHeight: 80 }}
            />
            <TouchableOpacity>
              <Ionicons name="happy-outline" size={28} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={handleSendMessage}
            disabled={!message.trim()}
            className={`
              p-2 rounded-full
              ${message.trim() ? 'bg-blue-500' : 'bg-gray-300'}
            `}
          >
            <Ionicons 
              name="send" 
              size={36} 
              color="white"
              style={{ transform: [{ rotate: '0deg' }] }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}