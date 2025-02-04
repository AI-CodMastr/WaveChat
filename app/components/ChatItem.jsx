import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import { getRoomId, formateDate } from '../../utils/common';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import { blurhash } from '../../utils/common';
  import { Image } from 'expo-image';
import { collection, doc, onSnapshot, orderBy, query, where, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


export default function ChatItem({item, router, noBorder, currentUser}) {

     const [lastMessage, setLastMessage] = useState(undefined);

    useEffect(() => {

        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");

        // Get last message only
        const lastMessageQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

        const unsubLastMessage = onSnapshot(lastMessageQuery, (snapshot) => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setLastMessage(messages[0] || null);
        });

        return () => {
          unsubLastMessage();
        };
    }, []);

    console.log("last msg :", lastMessage);


    const openChatroom = ()=> {
        router.push({pathname: '/chatRoom', params: item});
    }

    const getTimeDisplay = (timestamp) => {
        if (!timestamp) return '';
        
        const messageDate = new Date(timestamp.toDate());
        const now = new Date();
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);
        
        // If message is from today, show only time
        if (diffInHours < 24 && messageDate.getDate() === now.getDate()) {
          return messageDate.toLocaleTimeString([], { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          });
        }
        
        // If message is from this week (last 7 days), show day name
        if (diffInHours < 168) { // 7 days * 24 hours
          return messageDate.toLocaleDateString([], { weekday: 'short' });
        }
        
        // If older than a week, show date
        return messageDate.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          year: messageDate.getFullYear() !== now.getFullYear() ? '2-digit' : undefined
        });
    };

    const renderTime = () => {
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return getTimeDisplay(date);
              
            // console.log('last msg time :', lastMessage?.createdAt);
        }
        return 'Time';
    };

    const renderLastMessage = () => {
        if (typeof lastMessage === 'undefined') {
          return 'Loading...';
        }
        if (!lastMessage) {
          return 'Start a conversation 👋';
        }

        const isLastMessageRead = lastMessage.read || lastMessage.userId === currentUser?.userId;
        const lastSeenTime = lastMessage.createdAt ? getTimeDisplay(lastMessage.createdAt) : '';
        
        if (isLastMessageRead) {
          return `Last seen ${lastSeenTime}`;
        }

        if (currentUser?.userId === lastMessage.userId) {
          return `You: ${lastMessage.text}`;
        }
        
        return lastMessage.text;
    };

  return (
    <TouchableOpacity onPress={openChatroom} className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2
     ${noBorder? '' : 'border-b border-b-neutral-200'}`}>

      <Image 
      source={item.profileUrl} 
       style={{height: hp(6), width: hp(6), borderRadius: 100}}
       placeholder={blurhash}
       transition={500}
      />

      {/* name, last msg and time  */}
       <View className="flex-1 gap-1">
        <View className="flex-row justify-between items-center">
            <Text style={{fontSize: hp(2.4)}} className="font-semibold text-neutral-800">{item?.username}</Text>
            <Text style={{fontSize: hp(1.9)}} className="font-medium text-neutral-600">
              {renderTime()}
            </Text>
        </View>
        <Text 
          style={{fontSize: hp(1.8)}} 
          className={`font-medium ${lastMessage?.read ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {renderLastMessage()}
        </Text>

       </View>

    </TouchableOpacity>
  )
}
