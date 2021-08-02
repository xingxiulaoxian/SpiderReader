import { StackScreenProps, HeaderHeightContext } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import {
  Button,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MainContext } from '../context';
import { Book } from '../db/BookSchema';
import serverSearch from '../services/search';

const { height } = Dimensions.get('window');

function Search({ navigation }: StackScreenProps<any>) {
  const context = useContext(MainContext);
  const headerContext = useContext(HeaderHeightContext);
  const [list, setList] = useState<Book[]>([]);

  console.log(headerContext, height, list);
  const search = (
    ev: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    serverSearch(context.platform, ev.nativeEvent.text).then(setList);
  };

  return (
    <View>
      <TextInput style={styles.input} onSubmitEditing={search} />
      <View
        style={{
          height: height - 40 - (headerContext || 0) - 25,
        }}
      >
        <FlatList
          data={list}
          keyExtractor={item => `${item.bid}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                navigation.navigate('Menus', {
                  url: item.url,
                });
              }}
            >
              <Text style={styles.title}>
                {item.name} - {item.author}
              </Text>
              <Button
                title="star"
                onPress={() => {
                  context.store.create('Book', {
                    ...item,
                    star: true,
                    init: true,
                  });
                }}
              />
            </TouchableOpacity>
          )}
        />
        <Text>---END---</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
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

export default Search;
