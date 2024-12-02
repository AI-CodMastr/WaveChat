import { View, Text, StatusBar } from 'react-native';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/common';
import { useAuth } from '../../context/authContext';
import {
    Menu,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import { MenueItems } from './CustomMenu';
import { AntDesign, Feather } from '@expo/vector-icons';


export default function HomeHeader() {
    const { user, logOut } = useAuth();

    const handleProfile = () => {
        // Navigate to profile page
    };

    const handleLogout = async () => {
        await logOut();
        // Navigate to login page
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            <View style={{ paddingTop: hp(2) }} className='flex-row justify-between px-4 bg-blue-500 pb-5 rounded-b-2xl shadow'>
                <View>
                    <Text style={{ fontSize: hp(4) }} className='font-semibold text-white'>Chats</Text>
                </View>

                <View>
                    <Menu>
                        <MenuTrigger>
                            <Image
                                style={{ height: hp(5.5), aspectRatio: 1, borderRadius: 100 }}
                                source={user?.profileUrl}
                                placeholder={blurhash}
                                transition={500}
                            />

                        </MenuTrigger>
                        <MenuOptions customStyles={{
                            optionsContainer: {
                                borderRadius: 10,
                                borderCurve: 'continuous',
                                marginTop: 40,
                                marginLeft: -30,
                                backgroundColor: 'white',
                                shadowOpacity: 0.2,
                                shadowOffset: {width: 0, height: 0},
                                width: 160
                            }
                        }}>
                            <MenueItems 
                            text="Profile"
                            action={handleProfile}
                            value={null}
                            icon={<Feather name="user" size={24} color="#737373" />}
                            />
                            <Devider />
                              <MenueItems 
                            text="Sign out"
                            action={handleLogout}
                            value={null}
                            icon={<AntDesign name="logout" size={24} color="#737373" />}
                            />
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        </>
    );
}

const Devider = () => {
    return (
        <View className='p-[1px] w-full bg-neutral-200' />
    )
}