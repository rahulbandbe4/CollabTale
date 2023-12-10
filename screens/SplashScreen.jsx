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
        const checkLoggedInUser = async () => {
            firebaseAuth.onAuthStateChanged(async (userCred) => {
                try {
                    if (userCred?.uid) {
                        // const docSnap = await getDoc(doc(firestoreDB, "user", userCred.uid));
                        // if (docSnap.exists()) {
                        //     dispatch(setUser(docSnap.data()));
                        // }
                        setTimeout(() => {
                            navigation.replace("HomeScreen");
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            navigation.replace("WelcomeScreen");
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error in checkLoggedInUser:', error);
                }
            });
        }

        checkLoggedInUser();
    }, [dispatch, navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Image source={logo} resizeMode='contain' style={{ width: 208, height: 31 }} />
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    );
};

export default SplashScreen;
