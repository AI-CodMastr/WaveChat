import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from './components/Loading';
import { useAuth } from '../context/authContext';
import { Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function SignIn() {
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Sign In', "Please fill the all fields!")
            return;

        }

        setLoading(true);
        const response = await login(emailRef.current, passwordRef.current);
        setLoading(false);
        console.log('Sign In :', response)
        if (!response.success) {
            Alert.alert('Sign In', response.msg)
        }
    }

    const handleForgotPassword = async () => {
        try {
            if (!emailRef.current) {
                Alert.alert('Reset Password', 'Please enter your email address first');
                return;
            }

            setLoading(true);
            await sendPasswordResetEmail(auth, emailRef.current);
            Alert.alert(
                'Reset Password',
                'Password reset link has been sent to your email',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Password reset error:', error);
            let message = 'Failed to send reset email';
            if (error.code === 'auth/user-not-found') {
                message = 'No user found with this email';
            }
            if (error.code === 'auth/invalid-email') {
                message = 'Please enter a valid email';
            }
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            <View className="flex-1">
                <StatusBar style="dark" />
                <View className="flex-1 p-5">
                    {/* Login Image */}
                    <View style={{ paddingTop: hp(6) }} className="items-center mt-8">
                        <Image
                            style={{ width: wp(70), height: hp(20) }}
                            source={require('../assets/images/login.jpg')}
                        />
                    </View>

                    {/* Title */}
                    <Text
                        style={{ fontSize: hp(4) }}
                        className="font-bold tracking-wider text-center text-neutral-800 mt-6"
                    >
                        Sign In
                    </Text>

                    {/* Inputs */}
                    <View className="mt-8 gap-6">
                        {/* Email Input */}
                        <View style={{ height: hp(8) }} className="flex-row items-center gap-4 bg-neutral-100 text-neutral-800 rounded-xl px-4 py-2">
                            <Octicons name="mail" size={hp(2.9)} color="gray" />
                            <TextInput
                                onChangeText={value => emailRef.current = value}
                                style={{ fontSize: hp(2) }}
                                placeholder="Email address"
                                className="flex-1 ml-3 text-lg text-gray-700"
                                keyboardType="email-address"
                                placeholderTextColor={'grey'}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ height: hp(8) }} className="flex-row items-center gap-4 bg-neutral-100 text-neutral-800 rounded-xl px-4 py-2">
                            <Octicons name="lock" size={hp(2.9)} color="gray" />
                            <TextInput
                                onChangeText={value => passwordRef.current = value}
                                style={{ fontSize: hp(2) }}
                                placeholder="Password"
                                className="flex-1 ml-3 text-lg text-gray-700"
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity 
                        onPress={handleForgotPassword}
                        className="mt-2"
                    >
                        <Text style={{ fontSize: hp(2.1) }} className="text-right text-neutral-400 font-medium">
                            Forgot password?
                        </Text>
                    </TouchableOpacity>

                    <View>
                        {
                            loading ? (
                                <View className='flex-row justify-center'>
                                    <Loading size={hp(10)} />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleLogin} style={{ height: hp(7.5) }} className="bg-[#3B82F6] rounded-xl mt-6  items-center justify-center">
                                    <Text style={{ fontSize: hp(2.7) }} className="text-center text-white font-bold tracking-wider">Sign In</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>

                    {/* Sign-Up Prompt */}
                    <View className="flex-row justify-center mt-6">
                        <Text style={{ fontSize: hp(2.1) }} className="text-neutral-400 font-semibold">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('signUp')}>
                            <Text style={{ fontSize: hp(2.1) }} className="text-[#3B82F6] font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};