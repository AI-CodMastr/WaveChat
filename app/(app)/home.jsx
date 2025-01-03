import { View, Text, StatusBar, } from 'react-native'
import React, { useRef } from 'react'
import { useAuth } from '../../context/authContext';
import { useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChatList from '../components/ChatList';
import { ActivityIndicator } from 'react-native';
import Loading from '../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function Home() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log('Current user:', user);
                if (!user?.userId) {
                    console.log('No authenticated user');
                    return;
                }

                console.log('Fetching users from Firebase...');
                const usersRef = collection(db, 'users');
                const q = query(usersRef);
                
                console.log('Query created, fetching docs...');
                const querySnapshot = await getDocs(q);
                let data = [];
                
                querySnapshot.forEach(doc => {
                    if (doc.data().userId !== user.userId) {
                        console.log('User doc:', doc.data());
                        data.push({...doc.data(), id: doc.id});
                    }
                });
                
                console.log('Total users fetched:', data.length);
                setUsers(data);
            } catch (error) {
                console.error('Error details:', error.code, error.message);
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) {
            fetchUsers();
        }
    }, [user]);

    if (loading) {
        return <Loading />;
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

            {users.length > 0 ? (
                <ChatList currentUser={user} users={users} />
            ) : (
                <View className='flex-1 items-center' style={{top: hp(30)}}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            )}
        </View>
    );
}

