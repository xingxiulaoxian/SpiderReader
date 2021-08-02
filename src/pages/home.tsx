import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Pages {
  title: string;
  link: string;
}

const DATA: Pages[] = [
  { title: '个人中心', link: 'Me' },
  { title: '搜索', link: 'Search' },
];

const HomeItem = ({
  title,
  link,
  onPress = () => {},
}: Pages & {
  onPress(): void;
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.item}>
        <Text style={styles.title}>
          {title} {link}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Home: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => (
        <HomeItem
          onPress={() => navigation.navigate(item.link)}
          title={item.title}
          link={item.link}
        />
      )}
      keyExtractor={item => item.link}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Home;
