import { View, Text, TouchableOpacity, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/authContext';
import { router } from 'expo-router';
import { blurhash } from '../utils/common';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export default function EditProfileScreen() {
  const { user, updateUserInContext } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profileUrl);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      if (!username.trim()) {
        Alert.alert('Error', 'Username cannot be empty');
        return;
      }

      setLoading(true);
      let profileUrl = user?.profileUrl;

      // Upload new image if changed
      if (imageUrl !== user?.profileUrl) {
        profileUrl = await uploadImage(imageUrl);
      }

      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        username,
        profileUrl
      });

      // Update auth profile
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: profileUrl
      });

      // Update context
      updateUserInContext({
        ...user,
        username,
        profileUrl
      });

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View style={{ paddingTop: 20 }} className="flex-row justify-between items-center px-4 bg-blue-500 pb-5 rounded-b-3xl shadow">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 }} className="font-semibold text-white">Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Profile Section */}
        <View className="flex-1">
          {/* Profile Picture */}
          <View className="items-center mt-6">
            <View className="relative">
              <Image
                style={{ height: 100, width: 100, borderRadius: 50 }}
                source={imageUrl ? { uri: imageUrl } : user?.profileUrl}
                placeholder={blurhash}
                transition={500}
              />
              <TouchableOpacity 
                className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center"
                onPress={pickImage}
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Edit Fields */}
          <View className="mt-8 mx-4 space-y-4">
            <View className="space-y-2">
              <Text className="text-gray-600 font-medium ml-1">Username</Text>
              <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                <Ionicons name="person-outline" size={24} color="#3B82F6" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-gray-600 font-medium ml-1">Email</Text>
              <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                <Ionicons name="mail-outline" size={24} color="#3B82F6" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            className={`flex-row items-center justify-center p-4 mx-4 mt-8 rounded-xl ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-medium text-lg">
              {loading ? <Text>Saving...</Text> : <Text>Save Changes</Text>}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
