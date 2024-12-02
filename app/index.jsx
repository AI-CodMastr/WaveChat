import { ActivityIndicator, StatusBar, Text, View } from 'react-native'
import React from 'react'

export default function StartPage() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color='grey' />
    </View>
  )
}
