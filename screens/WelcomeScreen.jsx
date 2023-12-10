import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { logo, welcomeIllus } from '../assets'
import { useNavigation } from '@react-navigation/native'

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header logo and slogan */}
      <View style={styles.mainLogo}>
        <Image
          source={logo}
          style={{ width: 208, height: 31, resizeMode: "contain" }}
        />
        <Text style={{ fontFamily: 'roboto', fontSize: 18, color: "#555555" }}>Collaborate on stories with ease</Text>
      </View>
      {/* Welcome Illuastration */}
      <View style={styles.welcomeImage}>
        <Image source={welcomeIllus} style={{
          width: 261,
          height: 261,
          resizeMode: "contain",
        }} />
      </View>
      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttons} onPress={() => { navigation.navigate('LoginScreen') }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => { navigation.navigate('RegisterScreen') }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mainLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  welcomeImage: {
    justifyContent: 'center',
    flex: 2,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  buttons: {
    backgroundColor: '#FFA500',
    paddingVertical: 20,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10,
  }
})

export default WelcomeScreen