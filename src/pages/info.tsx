import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import serveInfo from '../services/info';

interface ParagraphsProps {
  text: string;
}

function Paragraphs({ text }: ParagraphsProps) {
  return (
    <View>
      <Text style={styles.paragraphs}>&emsp;&emsp;{text}</Text>
    </View>
  );
}

function Info({ navigation, route }: StackScreenProps<any>) {
  const { params } = route;
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const getData = (url: string) => {
    serveInfo(url).then(res => {
      setParagraphs(res);
    });
  };

  useEffect(() => {
    console.log(navigation, params);
    getData(params?.url);
  }, [navigation, params]);

  return (
    <ScrollView style={styles.container}>
      <Paragraphs text="" />
      {paragraphs.map((v, index) => (
        <Paragraphs key={index} text={v} />
      ))}
      <Paragraphs text="" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  paragraphs: {
    textAlign: 'justify',
  },
});

export default Info;
