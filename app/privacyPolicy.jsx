import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <View style={{ paddingTop: 20 }} className="flex-row justify-between items-center px-4 bg-blue-500 pb-5 rounded-b-3xl shadow">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 }} className="font-semibold text-white">Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">WaveChat Privacy Policy</Text>
        
        <View className="space-y-6">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">1. Information We Collect</Text>
            <Text className="text-gray-600 leading-6">
              <Text>• Profile Information: Username, email address, and profile picture</Text>{'\n'}
              <Text>• Communication Data: Messages, images, and other content you share</Text>{'\n'}
              <Text>• Usage Information: How you interact with our app</Text>{'\n'}
              <Text>• Device Information: Device type, operating system, and app version</Text>
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">2. How We Use Your Information</Text>
            <Text className="text-gray-600 leading-6">
              <Text>• To provide and maintain the WaveChat service</Text>{'\n'}
              <Text>• To enable communication between users</Text>{'\n'}
              <Text>• To improve and personalize your experience</Text>{'\n'}
              <Text>• To ensure security and prevent abuse</Text>
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">3. Data Security</Text>
            <Text className="text-gray-600 leading-6">
              We implement industry-standard security measures to protect your data. Your messages and personal information are encrypted and securely stored using Firebase services.
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">4. Data Sharing</Text>
            <Text className="text-gray-600 leading-6">
              We do not sell or share your personal information with third parties. Your data is only used within the WaveChat app for providing our services.
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">5. User Rights</Text>
            <Text className="text-gray-600 leading-6">
              <Text>You have the right to:</Text>{'\n'}
              <Text>• Access your personal data</Text>{'\n'}
              <Text>• Update or correct your information</Text>{'\n'}
              <Text>• Delete your account and data</Text>{'\n'}
              <Text>• Control your privacy settings</Text>
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">6. Changes to Policy</Text>
            <Text className="text-gray-600 leading-6">
              We may update this privacy policy from time to time. We will notify you of any significant changes through the app or email.
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">7. Contact Us</Text>
            <Text className="text-gray-600 leading-6">
              If you have any questions about our privacy policy or data practices, please contact us at support@wavechat.com
            </Text>
          </View>

          <Text className="text-gray-500 text-sm mt-6">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
