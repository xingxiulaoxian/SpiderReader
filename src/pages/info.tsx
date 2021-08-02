import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
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
interface Params {
  url: string;
  top: number | undefined;
}
function Info({ route }: StackScreenProps<any>) {
  const ref: React.MutableRefObject<ScrollView | null> = useRef(null);
  const { url, top } = route.params as Params;
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  useEffect(() => {
    console.log(url, top);
    serveInfo(url).then(res => {
      setParagraphs(res);
      ref.current?.scrollTo(top || 0);
    });
  }, [url, top]);

  return (
    <ScrollView ref={ref} style={styles.container}>
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
