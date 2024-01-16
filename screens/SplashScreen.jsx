import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux-store/slices/userAuthSlice';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { logo } from '../assets';

const SplashScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (userCred) => {
            try {
                if (userCred?.uid) {
                    const docSnap = await getDoc(doc(firestoreDB, "users", userCred.uid));
                    if (docSnap.exists()) {
                        dispatch(setUser(docSnap.data()));
                    }
                    navigation.replace("HomeScreen");
                } else {
                    navigation.replace("WelcomeScreen");
                }
            } catch (error) {
                console.error('Error in checkLoggedInUser:', error);
            }
        });

        // Cleanup function to unsubscribe the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Image source={logo} resizeMode='contain' style={{ width: 208, height: 31 }} />
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    );
};

export default SplashScreen;
