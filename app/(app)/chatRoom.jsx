import { View, Text, StatusBar, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ChatRoomHeader from '../components/ChatRoomHeader';
import MessageList from '../components/MessageList';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getRoomId } from '../../utils/common';

export default function ChatRoom() {
    const item = useLocalSearchParams();
    const router = useRouter();
    const {user} = useAuth()
    const [messages, setMessages] = useState([]);
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
        let message = textRef.current.trim();
        if(!message) return;
        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, "rooms", roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if(inputRef) inputRef?.current?.clear(); 
            const newDoc =await addDoc(messagesRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });

            console.log('new message Id :', newDoc.id);
        }catch(err){
            Alert.alert("message", err.message);
        }
    }

    // console.log('get all msgs :', messages);
  return (
    <View className='flex-1 bg-indigo-600'>
      <ChatRoomHeader user={item} router={router} />  
      <View className='border-b border-b-neutral-200' />
      <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
        <View className='flex-1'>
            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
        </View>

<View  style={{marginBottom: hp(1.2)}} className='pt-2'>
        <View className="flex-row items-center justify-between mx-4 ">
      <View className="flex-row items-center bg-white border border-neutral-200 rounded-full py-2 px-4 flex-1">
        <TextInput 
        ref={inputRef}
        onChangeText={value => textRef.current = value}
          className="flex-1 text-neutral-700 text-base mr-2"
          placeholder="Type message..."
          placeholderTextColor="#A1A1A1"
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Feather name="send" size={hp(3.9)} color="#737373" />
        </TouchableOpacity>
      </View>
    </View>
    </View>

      </View>
    </View>
  )
}