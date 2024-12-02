import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/authContext';

export default function Home() {
    const { logOut, user } = useAuth();
    const LogOut = async () => {
        await logOut();
    }
    // console.log('user :', user);
  return (
    <View className="flex-1 bg-white">
      <Text>Home</Text>
      <Pressable onPress={LogOut}>
        <Text className=''>Logout</Text>
      </Pressable>
    </View>
  )
}

