import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { logo } from '../assets'
import { useNavigation } from '@react-navigation/native'
import { UserTextInput } from '../components'
import { avatars } from '../assets/avatar'
import Icon from 'react-native-vector-icons/FontAwesome'
import FastImage from 'react-native-fast-image'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'

const RegisterScreen = () => {
    // hooks
    const navigation = useNavigation();

    // usestates
    const [userFullName, setuserFullName] = useState();
    const [userEmail, setuserEmail] = useState('');
    const [userPass, setuserPass] = useState('');
    const [isSelectAvatar, setIsSelectAvatar] = useState(false);
    const [userAvatars, setuserAvatars] = useState(avatars[0]?.image.asset.url);

    // user defined functions
    const handleSignUp = async () => {
        if (userEmail !== "") {
            await createUserWithEmailAndPassword(firebaseAuth, userEmail, userPass).then((userCred) => {
                const data = {
                    _id: userCred?.user.uid,
                    fullName: userFullName,
                    profilePic: userAvatars,
                    providerData: userCred.user.providerData[0],
                }

                setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data).then(() => {
                    navigation.navigate("LoginScreen");
                })
            })
        }
    }

    return (
        <View style={styles.container}>
            {/* Header logo and slogan with avatar */}
            <View style={styles.mainLogo}>
                <View style={{ alignItems: 'center' }}>
                    <FastImage
                        source={logo}
                        style={{ width: 208, height: 31, resizeMode: "contain", marginTop: 20 }}
                    />
                    <Text style={[styles.allText, { textAlign: 'center', fontSize: 16 }]}>Collaborate on stories with ease</Text>
                </View>
                <View style={styles.welcomeImage}>
                    <View style={{ position: 'relative', alignItems: 'flex-end' }}>
                        <FastImage
                            source={{ uri: userAvatars }}
                            resizeMode='contain'
                            style={{
                                width: 100,
                                height: 100,
                                borderWidth: 2,
                                borderColor: 'green',
                                borderRadius: 100,
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => { setIsSelectAvatar(true) }}
                            style={{
                                position: 'absolute',
                            }}
                        >
                            <Icon
                                name='edit'
                                size={15}
                                color='#000000'
                                style={{
                                    backgroundColor: '#bbbec0',
                                    borderRadius: 100,
                                    padding: 8,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Sign up panel */}
            <View style={styles.loginPanel}>
                <Text style={[styles.allText, { marginBottom: -15 }]}>Full Name</Text>
                <UserTextInput placeholder="Enter your full name" isPass={false} value={userFullName} onChangeText={setuserFullName} />
                <Text style={[styles.allText, { marginBottom: -15 }]}>Email</Text>
                <UserTextInput placeholder="Enter your email" isPass={false} value={userEmail} onChangeText={setuserEmail} />
                <Text style={[styles.allText, { marginBottom: -15 }]}>Password</Text>
                <UserTextInput placeholder="Enter your password" isPass={true} value={userPass} onChangeText={setuserPass} />
                <TouchableOpacity style={styles.buttons} onPress={handleSignUp}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }}>
                    <Text style={[styles.allText, { textAlign: 'center' }]}>Already have an account? <Text style={{ color: 'blue', fontWeight: 'bold' }}>Sign In</Text></Text>
                </TouchableOpacity>
            </View>

            {/* List of avatars */}
            {isSelectAvatar &&
                <View style={styles.avatarList}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.avatarListContent}>
                            {avatars?.map((items) => {
                                console.log(items);
                                return (
                                    <TouchableOpacity key={items._id} onPress={() => {
                                        setuserAvatars(items?.image.asset.url);
                                        setIsSelectAvatar(false);
                                    }
                                    }>
                                        <FastImage source={{ uri: items?.image.asset.url }} style={{ width: 80, height: 80 }} resizeMode={FastImage.resizeMode.contain} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        position: 'relative'
    },
    allText: {
        fontFamily: 'poppins',
        color: '#555555',
    },
    mainLogo: {
        flex: 1,
        alignItems: 'center',
    },
    welcomeImage: {
        justifyContent: 'center',
        flex: 1,
    },
    loginPanel: {
        gap: 20,
        padding: 20,
    },
    buttons: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 50,
        paddingVertical: 20,
        borderRadius: 10,
    },
    avatarList: {
        backgroundColor: '#80808080',
        position: 'absolute',
        zIndex: 2,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    avatarListContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 20,
        padding: 20,
    },
})

export default RegisterScreen