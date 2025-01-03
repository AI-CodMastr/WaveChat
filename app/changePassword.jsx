import { View, Text, TouchableOpacity, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'New password should be at least 6 characters');
        return;
      }

      setLoading(true);
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Re-authenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      Alert.alert('Success', 'Password updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Change password error:', error);
      let errorMessage = 'Failed to change password';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      }
      Alert.alert('Error', errorMessage);
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
        <Text style={{ fontSize: 24 }} className="font-semibold text-white">Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Password Fields */}
        <View className="flex-1 mt-8 mx-4 space-y-4">
          <View className="space-y-2">
            <Text className="text-gray-600 font-medium ml-1">Current Password</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
              <Ionicons name="lock-closed-outline" size={24} color="#3B82F6" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-gray-600 font-medium ml-1">New Password</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
              <Ionicons name="key-outline" size={24} color="#3B82F6" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-gray-600 font-medium ml-1">Confirm New Password</Text>
            <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
              <Ionicons name="key-outline" size={24} color="#3B82F6" />
              <TextInput
                className="flex-1 ml-3 text-gray-700"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity 
            onPress={handleChangePassword}
            disabled={loading}
            className={`flex-row items-center justify-center p-4 mx-4 mt-8 rounded-xl ${loading ? 'bg-blue-300' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-medium text-lg">
              {loading ? <Text>Changing Password...</Text> : <Text>Change Password</Text>}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
