import { View, Text, StyleSheet, Pressable, Dimensions, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { signOut } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserNull } from '../redux-store/slices/userAuthSlice';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [postCount, setPostCount] = useState(0);
  const [contribCount, setcontribCount] = useState(0);
  const [storyData, setStoryData] = useState();

  useEffect(() => {
    const postRef = collection(firestoreDB, "published-stories");
    const queryById = query(postRef, where('userID', '==', user?._id));
    const unsubscribe = onSnapshot(queryById, (snapShot) => {
      setPostCount(snapShot.size);
      const storiesData = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStoryData(storiesData);
    })

    return () => {
      unsubscribe();
    }
  }, [])

  const handleCardPress = (item) => {
    navigation.navigate('StoryViewScreen', { itemData: item });
  };

  const handleLogOut = async () => {
    try {
      await signOut(firebaseAuth)
      dispatch(setUserNull());
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <FastImage source={{ uri: user?.profilePic }} resizeMode={FastImage.resizeMode.contain} style={{ width: 100, height: 100, }} />
          <View style={{ gap: 10 }}>
            <Text>{user?.fullName}</Text>
            <Button title='Edit' />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <View>
            <Text>Publish</Text>
            <Text style={{ textAlign: 'center' }}>{postCount}</Text>
          </View>
          <View>
            <Text>Contributions</Text>
            <Text style={{ textAlign: 'center' }}>{contribCount}</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={storyData}
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
      />
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
  profile: {
    width: 320,
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 15,
    gap: 10,
  },
  buttons: {
    backgroundColor: '#FFA500',
    paddingVertical: 20,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
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
})

export default ProfileScreen