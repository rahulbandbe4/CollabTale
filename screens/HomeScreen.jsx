import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { cycle, logo } from '../assets'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const HomeScreen = () => {
    const navigation = useNavigation();
    const currentUser = useSelector((state) => state.user);
    console.log('Yo i am from redux store', currentUser);
    const [activeButton, setActiveButton] = useState('recent'); // Track the active button
    const handleListBtn = (buttonId) => {
        setActiveButton(buttonId);
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    {/* Top logo */}
                    <View style={styles.topLogo}>
                        <FastImage source={logo} resizeMode={FastImage.resizeMode.contain} style={{ width: 150, height: 20 }} />
                    </View>
                    <ScrollView style={{ flex: 1 }} horizontal={true}>
                        {/* Top Featured Cards */}
                        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
                            <Pressable>
                                <View style={styles.cards}></View>
                            </Pressable>
                            <Pressable>
                                <View style={styles.cards}></View>
                            </Pressable>
                        </View>
                    </ScrollView>

                    {/* Middle sections */}
                    <View>
                        {/* filter buttons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, }}>
                            <Pressable onPress={() => handleListBtn('recent')} style={activeButton === 'recent' ? styles.listBtnFocused : styles.listBtnUnfocused}>
                                <Text style={{ textAlign: 'center', color: activeButton === 'recent' ? '#ffffff' : '#F94A29' }}>Recent</Text>
                            </Pressable>
                            <Pressable onPress={() => handleListBtn('popular')} style={activeButton === 'popular' ? styles.listBtnFocused : styles.listBtnUnfocused}>
                                <Text style={{ textAlign: 'center', color: activeButton === 'popular' ? '#ffffff' : '#F94A29' }}>Popular</Text>
                            </Pressable>
                            <Pressable onPress={() => handleListBtn('trending')} style={activeButton === 'trending' ? styles.listBtnFocused : styles.listBtnUnfocused}>
                                <Text style={{ textAlign: 'center', color: activeButton === 'trending' ? '#ffffff' : '#F94A29' }}>Trending</Text>
                            </Pressable>
                        </View>

                        {/* flatcards */}
                        <View>
                            <Pressable style={styles.miniCards}>
                                <FastImage source={cycle} resizeMode={FastImage.resizeMode.contain} style={{ width: 100, height: 100, backgroundColor: '#D9D9D9', borderRadius: 15 }} />
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={styles.cardTitle}>Whispers of the heart</Text>
                                    <Text style={styles.cardDescription} numberOfLines={2}>Under the moonlit sky, they danced to the music, hearts entwined</Text>
                                    <View style={{ width: 40, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 5, borderColor: '#555555', borderWidth: 1 }}>
                                        <Text style={{ color: '#555555' }}>{5}</Text>
                                        <FontAwesome name="star" size={15} color="#555555" />
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    topLogo: {
        padding: 20,
    },
    cards: {
        width: 330,
        height: 250,
        backgroundColor: '#D9D9D9',
        borderRadius: 24,
    },
    cardTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#555555',
    },
    cardDescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#555555',
    },
    miniCards: {
        flexDirection: 'row',
        gap: 10,
        width: 320,
        height: 100,
    },
    listBtnFocused: {
        width: 80,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#F94A29',
        borderColor: '#F94A29',
        borderWidth: 2,
    },
    listBtnUnfocused: {
        width: 80,
        paddingVertical: 5,
        borderRadius: 5,
        borderColor: '#F94A29',
        borderWidth: 2,
    }
});

export default HomeScreen;