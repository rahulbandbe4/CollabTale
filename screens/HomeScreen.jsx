import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { cycle, logo } from '../assets'
import { useNavigation } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { collection, getDocs, limit, onSnapshot, query, startAfter } from 'firebase/firestore'
import { firestoreDB } from '../config/firebase.config'

const HomeScreen = () => {
    // hooks
    const navigation = useNavigation();

    // usestates
    const [activeButton, setActiveButton] = useState('recent');
    const [data, setData] = useState('');
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storiesCollection = collection(firestoreDB, 'published-stories');
        const queryRef = query(storiesCollection, limit(3));

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const storiesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(storiesData);
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            setLastDoc(lastDoc);
        });

        return () => {
            // Unsubscribe when the component is unmounted
            unsubscribe();
        };
    }, []);

    // user defined functions
    const storyFetchData = async (startAfterDoc) => {
        if (loading) {
            // Avoid fetching data if a fetch operation is already in progress
            return;
        }

        setLoading(true);

        const storiesCollection = collection(firestoreDB, 'published-stories');

        const queryRef = startAfterDoc
            ? query(storiesCollection, startAfter(startAfterDoc), limit(3))
            : query(storiesCollection, limit(3));

        try {
            const storiesSnapshot = await getDocs(queryRef);

            if (!storiesSnapshot.empty) {
                const storiesData = storiesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setData((prevData) => [...prevData, ...storiesData]);
                setLastDoc(storiesSnapshot.docs[storiesSnapshot.docs.length - 1]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleListBtn = (buttonId) => {
        setActiveButton(buttonId);
    };

    const handleCardPress = (item) => {
        navigation.navigate('StoryViewScreen', { itemData: item });
    };
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const containerHeight = event.nativeEvent.layoutMeasurement.height;

        if (offsetY + containerHeight >= contentHeight - 20 && lastDoc) {
            // Manually trigger fetching more data when near the end
            storyFetchData(lastDoc);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                {/* Top logo */}
                <View style={styles.topLogo}>
                    <FastImage source={logo} resizeMode={FastImage.resizeMode.contain} style={{ width: 150, height: 20 }} />
                </View>
                {/* Top Featured Cards */}
                <FlatList
                    horizontal
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={styles.topCards} onPress={() => handleCardPress(item)}>

                        </Pressable>
                    )}
                    style={{ marginLeft: 10 }}
                />

                {/* Middle sections */}
                {/* filter buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10 }}>
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
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={styles.miniCards} onPress={() => handleCardPress(item)}>
                            <FastImage source={{ uri: item?.coverImage[0]?.uri }} resizeMode={FastImage.resizeMode.contain} style={{ width: 120, height: 120, backgroundColor: '#D9D9D9', borderRadius: 15 }} />
                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.genre}>Genre | Type</Text>
                                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                                <View style={{ width: 40, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 5, borderColor: '#555555', borderWidth: 1 }}>
                                    <Text style={{ color: '#555555' }}>{5}</Text>
                                    <FontAwesome name="heart" size={15} color="red" />
                                </View>
                            </View>
                        </Pressable>
                    )}
                    style={{ flexGrow: 0, alignSelf: 'center' }}
                />
                {loading && <ActivityIndicator size="large" color="#00ff00" />}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topLogo: {
        padding: 20,
        alignSelf: 'center'
    },
    topCards: {
        width: 330,
        height: 250,
        backgroundColor: '#D9D9D9',
        borderRadius: 24,
        marginRight: 10,
    },
    cardTitle: {
        fontFamily: 'Poppins-Bold',
        color: '#555555',
    },
    cardDescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#555555',
    },
    miniCards: {
        backgroundColor: 'lightblue',
        borderRadius: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: 350,
        height: 150,
        marginBottom: 10
    },
    genre: {
        fontFamily: 'Poppins-Regular'
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