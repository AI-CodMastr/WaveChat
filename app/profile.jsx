import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/authContext';
import { router } from 'expo-router';
import { blurhash } from '../utils/common';


export default function ProfileScreen() {
 
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace('/signIn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View style={{ paddingTop: 20 }} className="flex-row items-center px-4 bg-blue-500 pb-5 rounded-b-3xl shadow">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 }} className="font-semibold text-white">Profile</Text>
      </View>

      {/* Profile Section */}
      <View className="flex-1">
        <View className="items-center mt-6">
          <View className="relative">
            <Image
              style={{ height: 80, width: 80, borderRadius: 40 }}
              source={user?.profileUrl}
              placeholder={blurhash}
              transition={500}
            />
            <View className="absolute bottom-0 right-0 bg-blue-500 w-5 h-5 rounded-full items-center justify-center">
              <View className="w-3 h-3 bg-white rounded-full" />
            </View>
          </View>
          <Text className="text-xl font-semibold mt-4">{user?.username}</Text>
          <Text className="text-gray-500 text-sm">{user?.email}</Text>
        </View>

        {/* Profile Options */}
        <View className="mt-8 mx-4">
          <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3" onPress={() => router.push('/editProfile')}>
            <Ionicons name="person-outline" size={24} color="#3B82F6" />
            <Text className="ml-3 text-gray-700 font-medium" >Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3" onPress={() => router.push('/changePassword')}>
            <Ionicons name="lock-closed-outline" size={24} color="#3B82F6" />
            <Text className="ml-3 text-gray-700 font-medium">Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3" onPress={() => router.push('/privacyPolicy')}>
            <Ionicons name="shield-outline" size={24} color="#3B82F6" />
            <Text className="ml-3 text-gray-700 font-medium">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3"
            onPress={() => router.push('/myLocation')}
          >
            <Ionicons name="location-outline" size={24} color="#3B82F6" />
            <View className="flex-1">
              <Text className="ml-3 text-gray-700 font-medium">My Location</Text>
              {user?.location && (
                <Text className="ml-3 text-gray-500 text-sm">
                  <Text>Last updated: {new Date(user.location.updatedAt).toLocaleDateString()}</Text>
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center p-4 mx-4 mt-auto mb-6 bg-gray-50 rounded-xl"
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="ml-3 text-red-500 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

