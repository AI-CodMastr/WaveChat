import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function ChatRoomHeader({user, router}) {

  return (
    <Stack.Screen
    options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: ()=> (
            <View style={{paddingVertical: hp(1)}} className='flex-row items-center gap-2'>
               <TouchableOpacity onPress={()=> router.back()}>
                <Entypo name='chevron-left' size={hp(4)} color='#737373' />
               </TouchableOpacity>
               <View className='flex-row items-center gap-3'>
                  <Image 
                  source={user?.profileUrl}
                  style={{height: hp(6.9), aspectRatio: 1, borderRadius: 100}}
                  />
                  <Text style={{fontSize: hp(2.6)}} className='text-neutral-700 font-medium'>
                    {user?.username}
                  </Text>
               </View>
            </View>
        ),
        headerRight: ()=> (
            <View className='flex-row items-center gap-8'>
                <TouchableOpacity>
               <Ionicons name='call' size={hp(3.8)} color='#737373' />  
                </TouchableOpacity>

                <TouchableOpacity>
               <Ionicons name='videocam' size={hp(3.8)} color='#737373' />  
               </TouchableOpacity>
            </View>
        )
    }}
    />
  )
}