import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ParagraphsProps {
  text: string;
}

const Paragraphs: React.FC<ParagraphsProps> = ({ text }) => {
  return (
    <View style={styles.p}>
      <Text style={styles.text}>&emsp;&emsp;{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  p: {
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Paragraphs;
