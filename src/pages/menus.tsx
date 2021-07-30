import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, FC } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import serveMenus, { MenusInterface } from '../services/menus';

type MenuItemProps = {
  title: string;
  url: string;
} & Partial<StackScreenProps<any>>;

const MenuItem: FC<MenuItemProps> = ({ title = '', url, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log(navigation);
        navigation.navigate('Info', {
          url,
        });
      }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const Menus: FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const { params } = route;
  const [data, setData] = useState<MenusInterface[]>([]);
  const handle = (url: string) => {
    serveMenus(url).then(setData);
  };

  useEffect(() => {
    handle(params?.url);
  }, [params]);

  return (
    <View>
      {/* <TextInput /> */}
      {/* <TouchableOpacity
        onPress={() => {
          handle(params?.url);
        }}
      >
        <Text>seerw</Text>
      </TouchableOpacity> */}
      <View>
        <FlatList
          keyExtractor={item => `${item.mid}`}
          data={data}
          renderItem={({ item }) => (
            <MenuItem
              title={item.name}
              url={item.url}
              navigation={navigation}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Menus;
