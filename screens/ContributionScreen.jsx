import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View, Dimensions, Button, Modal, TextInput, Alert } from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { addDoc, collection } from "firebase/firestore";
import DocumentPicker from 'react-native-document-picker';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;

const ContributionScreen = () => {
  // hooks
  const richText = useRef();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  // usestates
  const [storyTitle, setstoryTitle] = useState('');
  const [storyDescription, setstoryDescription] = useState('');
  const [storyText, setStoryText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedDocument, setPickedDocument] = useState('');

  // others
  const storyObject = {
    content: storyText,
    description: storyDescription,
    title: storyTitle,
    coverImage: pickedDocument,
    userName: user.fullName,
    userID: user._id,
  };

  //User defined functions

  const pickDocument = async () => {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    setPickedDocument(result);
  }

  const handleStoryPublish = async () => {
    await addDoc(collection(firestoreDB, "published-stories"), storyObject).then(() => {
      setStoryText('');
      setstoryTitle('');
      setstoryDescription('');
      setPickedDocument('');
      navigation.navigate("Home");
    })
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Model */}
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
            <View>
              <Text style={{ color: 'black' }}>Title</Text>
              <TextInput style={{ width: 300, padding: 10, borderWidth: 1, borderColor: '#888888', borderRadius: 10, color: 'black' }} value={storyTitle} onChangeText={(text) => setstoryTitle(text)} />
            </View>
            <View>
              <Text style={{ color: 'black' }}>Description</Text>
              <TextInput style={{ width: 300, height: 100, padding: 10, borderWidth: 1, borderColor: '#888888', borderRadius: 10, color: 'black' }} multiline={true} textAlignVertical="top" value={storyDescription} onChangeText={(text) => setstoryDescription(text)} />
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black' }}>Cover Image : </Text>
                <Text style={{ color: 'black' }}>{pickedDocument[0]?.uri}</Text>
              </View>
              <Button onPress={() => pickDocument()} title="Upload" style={{ alignSelf: 'center' }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 80, justifyContent: 'space-between' }}>
              <Button title="Close" color={'red'} onPress={() => setModalVisible(!modalVisible)} />
              <Button title="Publish" color={'green'} onPress={() => handleStoryPublish()} />
            </View>
          </View>
        </View>
      </Modal>

      {/* top section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 10 }}>
        <Text>Other Contents</Text>
        <View style={{}}>
          <Button title="Done" color={'black'} onPress={() => setModalVisible(true)} />
        </View>
      </View>

      {/* editor section */}
      <ScrollView keyboardShouldPersistTaps='handled' >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={{ height: Dimensions.get('window').height }}>
            <RichEditor
              useContainer={false}
              ref={richText}
              placeholder="hey type here..."
              onChange={descriptionText => {
                setStoryText(descriptionText);
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
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  toolbarContainer: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleText: {
    fontWeight: 'bold',
  },
  titleEditor: {
    flex: 1,
    borderRadius: 5,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#88888888',
  },
  modalView: {
    gap: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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

export default ContributionScreen;
