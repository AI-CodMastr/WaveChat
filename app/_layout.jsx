import { Slot, useRouter, useSegments } from "expo-router";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "../global.css";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
    // check if user isAuthenticated or not 
    if(typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0]=='(app)';
    if(isAuthenticated && !inApp) {
        // redirect to home
        router.replace('home')
    }else if(isAuthenticated==false) {
        // redirect to signin
        router.replace('signIn')
    }
    }, [isAuthenticated])
    return <Slot />

}
export default function RootLayout() {
  return (
    <MenuProvider>
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
    </MenuProvider>
  )
}



const styles = StyleSheet.create({})