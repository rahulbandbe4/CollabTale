import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Switch, KeyboardAvoidingView, SafeAreaView, Platform, Button, FlatList, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
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
    const [versionContent, setVersionContent] = useState(route.params.itemData);
    const [versionedStories, setVersionedStories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

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
        const docref = doc(firestoreDB, "published-stories", originalContent.id);
        const subCollection = collection(docref, "contributed-stories");
        //contributed data to be uploaded as a new story or newer version
        const contributedData = {
            userID: user._id,
            userName: user.fullName,
            title: originalContent.title,
            content: modifiedContent,
        }
        //adding the contributed document in the specified story
        await addDoc(subCollection, contributedData);
        navigation.navigate('HomeScreen');
    }
    const handleVersionDisplay = (item) => {
        setVersionContent(item)
        setModalVisible(false)
    }
    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const pageIndex = Math.floor(contentOffset.x / Dimensions.get('window').width);
        setCurrentPageIndex(pageIndex);
    };

    // others
    const source = {
        html: versionContent.content
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
                            <TouchableOpacity style={{ borderBottomColor: '#88888888', borderBottomWidth: 1 }} onPress={() => { setVersionContent(originalContent); setModalVisible(false) }}>
                                <Text style={{ color: 'black', textAlign: 'center', paddingVertical: 8 }}>Original</Text>
                            </TouchableOpacity>
                            {versionedStories.map((item) => (
                                <TouchableOpacity style={{ borderBottomColor: '#88888888', borderBottomWidth: 1 }} key={item.id.toString()} onPress={() => handleVersionDisplay(item)}>
                                    <Text style={{ color: 'black', textAlign: 'center', paddingVertical: 8 }}>{item.userName}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title='close' onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <View style={styles.top}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-circle-left" size={30} color={'black'} />
                </TouchableOpacity>
                {isEnabled ?
                    <Button title='Contribute' onPress={() => handleContribution()} />
                    :
                    <Button title='Versions' onPress={() => setModalVisible(true)} />
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
                        <ScrollView onScroll={handleScroll}>
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
    toolbarContainer: {
        bottom: 0,
        left: 0,
        right: 0,
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: 200,
        maxHeight: 250,
        marginTop: 50,
        gap: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default StoryViewScreen