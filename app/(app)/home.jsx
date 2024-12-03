import { View, Text, StatusBar, } from 'react-native'
import React, { useRef } from 'react'
import { useAuth } from '../../context/authContext';
import { useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChatList from '../components/ChatList';
import { ActivityIndicator } from 'react-native';
import Loading from '../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { userRef } from '../../firebaseConfig';


export default function Home() {
    const { logOut, user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
            // fetch users
            const q = query(userRef, where('userId', '!=', user?.uid));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach(doc=>{
              data.push({...doc.data()})
            });

            setUsers(data);
            // console.log('got users:', data);

    }
    const LogOut = async () => {
        await logOut();
    }
    // console.log('user :', user);
  return (
    <View className="flex-1 bg-white">
     <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

     {
      users.length>0? (
        <ChatList currentUser={user} users={users} />
      ):(
        <View className='flex-1 items-center' style={{top: hp(30)}}>
             <ActivityIndicator size="large" />
             {/* <Loading size={hp(20)} />   */}
        </View>
      )
     }
    </View>
  )
}

