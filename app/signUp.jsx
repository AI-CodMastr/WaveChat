import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from './components/Loading';
import { useAuth } from '../context/authContext';
import { Alert } from 'react-native';

export default function SignUp() {
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();
    const profileRef = useRef();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
            Alert.alert('Sign Up', "Please fill the all fields!")
            console.log('alert failed')
            return;

        }

        setLoading(true);
        //register press
        let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
        setLoading(false);
        console.log('got result:', response);

        if (!response.success) {
            Alert.alert('Sign Up', response.msg)
            console.log('routing faild')
        }

    }
    return (
        <ScrollView>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            <View className="flex-1">
                <StatusBar style="dark" />
                <View className="flex-1 p-5">
                    {/* Login Image */}
                    <View className="items-center mt-8">
                        <Image
                            style={{ width: wp(70), height: hp(20) }}
                            source={require('../assets/images/register.jpg')}
                        />
                    </View>

                    {/* Title */}
                    <Text
                        style={{ fontSize: hp(4) }}
                        className="font-bold tracking-wider text-center text-neutral-800 mt-6"
                    >
                        Sign Up
                    </Text>

                    {/* Inputs */}
                    <View className="mt-8">
                        <View style={{ height: hp(8) }} className="flex-row items-center gap-4 bg-neutral-100 text-neutral-800 rounded-xl px-4 py-2">
                            <Feather name="user" size={hp(2.9)} color="gray" />
                            <TextInput
                                onChangeText={value => usernameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                placeholder="Username"
                                className="flex-1 ml-3 text-lg text-gray-700"
                                keyboardType="email-address"
                                placeholderTextColor={'grey'}
                            />
                        </View>


                        <View className="mt-4">
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
                            <View className="mt-4">
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
                            <View className="mt-4">
                                {/* Email Input */}
                                <View style={{ height: hp(8) }} className="flex-row items-center gap-4 bg-neutral-100 text-neutral-800 rounded-xl px-4 py-2">
                                    <Feather name="image" size={hp(2.9)} color="gray" />
                                    <TextInput
                                        onChangeText={value => profileRef.current = value}
                                        style={{ fontSize: hp(2) }}
                                        placeholder="Profile Url"
                                        className="flex-1 ml-3 text-lg text-gray-700"
                                        keyboardType="profile url"
                                        placeholderTextColor={'grey'}
                                    />
                                </View>
                            </View>

                            {/* Forgot Password */}
                            {/* <TouchableOpacity className="mt-2">
                        <Text style={{ fontSize: hp(2.1) }} className="text-right text-neutral-400 font-medium">
                            Forgot password?
                        </Text>
                    </TouchableOpacity> */}

                            <View>
                                {
                                    loading ? (
                                        <View className='flex-row justify-center'>
                                            <Loading size={hp(10)} />
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={handleSignUp} style={{ height: hp(7.5) }} className="bg-[#3B82F6] rounded-xl mt-8 items-center justify-center">
                                            <Text style={{ fontSize: hp(2.7) }} className="text-center text-white font-bold tracking-wider">Sign Up</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>



                            {/* Sign-Up Prompt */}
                            <View className="flex-row justify-center mt-6">
                                <Text style={{ fontSize: hp(2.1) }} className="text-neutral-400 font-semibold">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('signIn')}>
                                    <Text style={{ fontSize: hp(2.1) }} className="bg-[#3B82F6] font-bold">Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}