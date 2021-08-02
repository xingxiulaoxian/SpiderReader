import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MainContext } from '../context';
import { Book } from '../db/BookSchema';

const Me: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const context = useContext(MainContext);

  const [data, setData] = useState<Book[]>([]);

  useEffect(() => {
    const books: Book[] = context.store.search('Book').toJSON();
    setData(books);
  }, [context.store]);

  return (
    <FlatList
      data={data}
      keyExtractor={item => `${item.bid}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            navigation.navigate('Menus', {
              url: item.url,
              bid: item.bid,
              rateOfProgress: {
                menuId: item.rateOfProgressMenuIdId,
                top: item.rateOfProgressTop,
              },
            });
          }}
        >
          <Text style={styles.title}>
            {item.name} - {item.author}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  title: {
    flex: 1,
    lineHeight: 24,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    fontSize: 14,
    marginLeft: 5,
    paddingRight: 5,
  },
});
export default Me;
