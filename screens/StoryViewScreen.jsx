import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Switch, KeyboardAvoidingView, SafeAreaView, Platform, Button, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { combineReducers } from '@reduxjs/toolkit';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';
import { useSelector } from 'react-redux';
import { HTMLRenderer } from '../components';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;

const StoryViewScreen = ({ route }) => {
    // hooks
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    const richText = useRef();

    // usestates
    const [isEnabled, setIsEnabled] = useState(false);
    const originalContent = route.params.itemData;
    const [modifiedContent, setModifiedContent] = useState(route.params.itemData);
    const [versionedStories, setVersionedStories] = useState('');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);


    useEffect(() => {
        const storiesVersion = async () => {
            const versionsRef = collection(firestoreDB, 'published-stories', originalContent.id, 'contributed-stories');
            const storiesSnapshot = await getDocs(versionsRef);
            const storiesData = [];
            storiesSnapshot.forEach((doc) => {
                storiesData.push({ id: doc.id, ...doc.data() });
            });
            setVersionedStories((prevData) => [...prevData, ...storiesData]);
        }

        storiesVersion();
    }, [])

    // user defined functions
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const handleContribution = async () => {
        //take reference to the individual user document
        const docref = doc(firestoreDB, 'published-stories', originalContent.id);
        const subCollection = collection(docref, "contributed-stories");
        //contributed data to be uploaded as a new story or newer version
        const contributedData = {
            userID: user._id,
            userName: user.fullName,
            title: originalContent.title,
            content: modifiedContent,
            isApproved: false,
        }
        //adding the contributed document in the specified story
        await addDoc(subCollection, contributedData);
        navigation.navigate('HomeScreen');
    }

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageIndex = Math.floor(contentOffset.x / Dimensions.get('window').width);
        setCurrentPageIndex(pageIndex);
    };

    // others
    const source = {
        html: originalContent.content
    }
    const tagStyles = {
        body: {
            color: 'black',
            fontSize: 16,
        },
        addedParagraph: {
            backgroundColor: 'yellow',
            display: 'block',
        },
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.top}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-circle-left" size={30} color={'black'} />
                </TouchableOpacity>
                {isEnabled &&
                    <Button title='Contribute' onPress={() => handleContribution()} />
                }
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            {
                isEnabled ?
                    //  contribution mode 
                    //  editor section 
                    <View style={{ flex: 1 }}>
                        <ScrollView keyboardShouldPersistTaps='handled'>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
                                <View style={{ height: Dimensions.get('window').height - 100 }}>
                                    <RichEditor
                                        initialContentHTML={source.html}
                                        useContainer={false}
                                        ref={richText}
                                        onChange={descriptionText => {
                                            setModifiedContent(descriptionText);
                                            console.log(descriptionText);
                                        }}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </ScrollView>
                        {/* toolbar section */}
                        <View style={styles.toolbarContainer}>
                            <RichToolbar
                                editor={richText}
                                actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1]}
                                iconMap={{ [actions.heading1]: handleHead }}
                            />
                        </View>
                    </View>
                    :
                    <>
                        {/* Read Mode */}
                        <ScrollView pagingEnabled onScroll={handleScroll}>
                            {/*<View style={styles.page}>
                                        <RenderHTML
                                            contentWidth={Dimensions.get('window').width}
                                            source={source}
                                            tagsStyles={tagStyles}
                                        />
                                    </View>*/}
                            {/* <HTMLRenderer content={source.html} /> */}
                            <HTMLRenderer content={source.html} />
                        </ScrollView>
                    </>
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        marginHorizontal: 30,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    page: {
        marginBottom: 10,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#f9e3bf',
        borderRadius: 20,
    },
    toolbarContainer: {
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default StoryViewScreen