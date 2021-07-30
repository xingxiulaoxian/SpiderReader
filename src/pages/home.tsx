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
  { title: '首页', link: 'Home' },
  { title: '搜索', link: 'Search' },
  { title: '详情', link: 'Info' },
  { title: '菜单', link: 'Menus' },
];

const Item = ({ title, link, navigation }: Pages) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.navigate(link);
      }}
    >
      <View style={styles.item}>
        <Text style={styles.title}>
          {title} {link}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function Home({ navigation }) {
  const renderItem = ({ item }) => (
    <Item navigation={navigation} title={item.title} link={item.link} />
  );
  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.link}
    />
  );
}

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
