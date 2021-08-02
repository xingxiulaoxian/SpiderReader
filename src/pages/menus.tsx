import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect, FC, useContext, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MainContext } from '../context';
import { Menu } from '../db/MenuSchema';
import serveMenus from '../services/menus';
import arr2obj from '../utils/arr2obj';
import diffMap from '../utils/diffMap';

type MenuItemProps = {
  title: string;
  read: boolean;
  index: number;
  onPress(): void;
};

const MenuItem: FC<MenuItemProps> = ({
  title = '',
  index,
  read = false,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ height: 24 }}>
        {read ? '◉' : '◔'} {index} {title}
      </Text>
    </TouchableOpacity>
  );
};

interface RateOfProgress {
  menuId: number;
  top: number;
}
interface Params {
  url?: string;
  bid: number;
  rateOfProgress?: RateOfProgress;
}

const filterData = (list: Menu[]) => {
  return list
    .filter(v => !v.local)
    .map(v => ({
      ...v,
      local: true,
    }));
};

const formatData = (
  local: Menu[],
  remote: Menu[],
  createHandel: (list: Menu[]) => void,
): Promise<Menu[]> => {
  return new Promise(resolve => {
    if (local.length < remote.length) {
      console.log('有更新。。。TODO');
      const diffListOfMap = diffMap(
        arr2obj(local, 'mid'),
        arr2obj(remote, 'mid'),
      );

      const diffListOfArray: Menu[] = [];
      diffListOfMap.forEach(value => {
        diffListOfArray.push(value);
      });

      const storage = filterData(diffListOfArray);
      createHandel(storage);
      resolve(local.concat(storage));
    } else {
      console.log('无更新');
      resolve(local);
    }
  });
};

const Menus: FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const context = useContext(MainContext);
  const ref: React.MutableRefObject<FlatList | null> = useRef(null);
  const { url, bid, rateOfProgress } = route.params as Params;
  const [data, setData] = useState<Menu[]>([]);

  const getDateFromDB = (_bid: number): Promise<Menu[]> => {
    return new Promise((resolve, reject) => {
      try {
        const menus = context.store.search('Menu');
        const menusByBid = menus.filtered(`bid=${_bid}`).sorted('menuSort');
        resolve(menusByBid.toJSON() || []);
      } catch (err) {
        console.warn(err);
        reject([]);
      }
    });
  };

  const create = (list: Menu[]) => {
    context.store.create('Menu', list);
  };

  useEffect(() => {
    if (url) {
      if (rateOfProgress) {
        Promise.all([getDateFromDB(bid), serveMenus(url, bid)]).then(
          ([dbList, webList]) => {
            formatData(dbList, webList, create).then(res => {
              setData(res);
              // 滚动到已读位置
              const index = res.findIndex(
                v => v.mid === rateOfProgress?.menuId,
              );
              ref.current?.scrollToIndex({
                index: index >= 0 ? index : 0,
              });
            });
          },
        );
      } else {
        serveMenus(url).then(setData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bid, rateOfProgress, url]);

  return (
    <View>
      <FlatList
        ref={ref}
        keyExtractor={item => `${item.mid}`}
        data={data}
        getItemLayout={(param, index) => ({
          length: 24,
          offset: 24 * index,
          index,
        })} //设置优化滚轮滑动效率  64为每个item高度
        renderItem={({ item, index }) => (
          <MenuItem
            title={item.title}
            read={item.read}
            index={index}
            onPress={() => {
              navigation.navigate('Info', {
                url: item.url,
                top: rateOfProgress?.top,
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default Menus;
