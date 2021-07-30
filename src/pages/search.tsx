import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { MainContext } from '../context';
import serverSearch, { Article } from '../services/search';

function Search({ navigation }: StackScreenProps<any>) {
  const context = useContext(MainContext);
  const [list, setList] = useState<Article[]>([]);

  const search = (
    ev: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    const text = ev.nativeEvent.text;
    serverSearch(context.platform, text).then(res => {
      console.log(res);
      setList(res);
    });
  };

  return (
    <View>
      <TextInput style={styles.input} onSubmitEditing={search} />
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Menus', {
                url: item.url,
              });
            }}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.url}
      />
      <Text>---END---</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default Search;
