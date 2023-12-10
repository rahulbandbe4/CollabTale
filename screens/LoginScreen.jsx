import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { loginIllus, logo } from '../assets'
import { useNavigation } from '@react-navigation/native'
import { UserTextInput } from '../components'
import FastImage from 'react-native-fast-image'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux-store/slices/userAuthSlice'

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    await signInWithEmailAndPassword(firebaseAuth, userName, userPass).then((userCred) => {
      if (userCred) {
        getDoc(doc(firestoreDB, 'users', userCred?.user.uid)).then(
          (docSnap) => {
            if (docSnap.exists()) {
              dispatch(setUser(docSnap.data()));
              navigation.navigate("HomeScreen");
            }
          }
        )
      }
    })
  }

  const [userName, setuserName] = useState('');
  const [userPass, setuserPass] = useState('');
  return (
    <View style={styles.container}>
      {/* Header logo and slogan with illustration*/}
      <View style={styles.mainLogo}>
        <View style={{ alignItems: 'center' }}>
          <FastImage
            source={logo}
            style={{ width: 208, height: 31, resizeMode: "contain", marginTop: 20 }}
          />
          <Text style={[styles.allText, { textAlign: 'center', fontSize: 16 }]}>Collaborate on stories with ease</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image source={loginIllus} style={{
            width: 261,
            height: 261,
            resizeMode: "contain",
          }} />
        </View>

      </View>

      {/* Login panel */}
      <View style={styles.loginPanel}>
        <Text style={[styles.allText, { marginBottom: -15, textAlign: 'left' }]}>Email</Text>
        <UserTextInput placeholder="Enter your username" isPass={false} value={userName} onChangeText={setuserName} style={styles.inputs} />

        <Text style={[styles.allText, { marginBottom: -15 }]}>Password</Text>
        <UserTextInput placeholder="Enter your password" isPass={true} value={userPass} onChangeText={setuserPass} />
        <Pressable>
          <Text style={[styles.allText, { textAlign: 'right', marginTop: -15 }]}>Forgot password ?</Text>
        </Pressable>

        <Pressable style={styles.buttons} onPress={handleSignIn}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>Sign In</Text>
        </Pressable>
        <Pressable onPress={() => { navigation.navigate('RegisterScreen') }}>
          <Text style={[styles.allText, { textAlign: 'center' }]}>Don't have an account?
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  allText: {
    fontFamily: 'poppins',
    color: '#555555',
  },
  mainLogo: {
    flex: 1,
    alignItems: 'center',
  },
  loginPanel: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
  buttons: {
    backgroundColor: '#FFA500',
    paddingVertical: 20,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10,
  },
})

export default LoginScreen