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
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ChatItem({item, router, noBorder, currentUser}) {

     const [lastMessage, setLastMessage] = useState(undefined);

    useEffect(() => {

        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapShot)=> {
            let allMessages = snapShot.docs.map(doc => {
                return doc.data();
            })
            setLastMessage(allMessages[0]? allMessages[0]: null);
        });

        return unsub;
    }, []);

    console.log("last msg :", lastMessage);


    const openChatroom = ()=> {
        router.push({pathname: '/chatRoom', params: item});
    }

    const renderTime = () => {
        if(lastMessage){
            let date = lastMessage?.createdAt;
            return formateDate(new Date(date?.seconds * 1000));
              
            // console.log('last msg time :', lastMessage?.createdAt);
        }
        return 'Time';
    };

    const renderLastMessage = () => {
        if(typeof lastMessage == 'undefined') return 'Loading...';
        if(lastMessage){
            if(currentUser?.userId == lastMessage?.userId) return "You: "+lastMessage?.text;
            return lastMessage?.text;
    }else{
        return "Say Hi 👋"
    }

    }

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
        <View className="flex-row justify-between">
            <Text style={{fontSize: hp(2.4)}} className="font-semibold text-neutral-800">{item?.username}</Text>
            <Text style={{fontSize: hp(1.9)}} className="font-medium text-neutral-600">{renderTime()}</Text>
        </View>
        <Text style={{fontSize: hp(1.8)}} className="font-medium text-neutral-500">{renderLastMessage()}</Text>

       </View>

    </TouchableOpacity>
  )
}
