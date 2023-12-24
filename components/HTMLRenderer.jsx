// HTMLRenderer.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const HTMLRenderer = ({ content }) => {
  const tagStyles = {
    body: {
      color: 'black',
      fontSize: 16,
    },
    addedParagraph: {
      backgroundColor: 'yellow',
      display: 'block',
    },
  };

  return (
    <View style={styles.container}>
      <RenderHTML
        contentWidth={Dimensions.get('window').width}
        source={{ html: content }}
        tagsStyles={tagStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#f9e3bf',
    borderRadius: 20,
  },
});

export default HTMLRenderer;
