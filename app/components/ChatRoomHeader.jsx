import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/common';

export default function ChatRoomHeader({user, router}) {
  return (
    <Stack.Screen
    options={{
        header: () => (
          <View className="bg-blue-500">
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            <View style={{paddingTop: 16, paddingBottom: 12}} className='flex-row items-center px-4'>
              <TouchableOpacity onPress={()=> router.back()} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <View className='flex-row items-center flex-1'>
                <Image 
                  source={user?.profileUrl}
                  style={{height: hp(7), width: hp(7), borderRadius: hp(4)}}
                  placeholder={blurhash}
                  transition={500}
                />
                <View className="ml-3">
                  <Text className='text-white font-semibold' style={{fontSize: hp(2.6)}}>
                    {user?.username}
                  </Text>
                  <Text className="text-white text-sm opacity-50">Online</Text>
                </View>
              </View>

              <View className='flex-row items-center gap-4'>
                <TouchableOpacity>
                  <Ionicons name='call' size={hp(3)} color='white' />  
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name='videocam' size={hp(3.5)} color='white' />  
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ),
        headerShown: true
    }}
    />
  )
}