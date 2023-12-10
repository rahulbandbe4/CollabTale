import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { avatars } from '../assets/avatar';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase.config';
import { useDispatch } from 'react-redux';
import { setUserNull } from '../redux-store/slices/userAuthSlice';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      await signOut(firebaseAuth);
      dispatch(setUserNull());
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{}}>
        <FastImage source={{ uri: avatars[1].image.asset.url }} resizeMode={FastImage.resizeMode.contain} style={{ width: 100, height: 100, }} />
      </View>
      <Pressable style={styles.buttons} onPress={handleLogOut}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff' }}>Log Out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: '#FFA500',
    paddingVertical: 20,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10,
  },
})

export default ProfileScreen