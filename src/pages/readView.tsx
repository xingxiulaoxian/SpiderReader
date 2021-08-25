import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import { MainContext, MainContextProps } from '../context';
import { Menu } from '../db/MenuSchema';
import arr2obj from '../utils/arr2obj';
import diffMap from '../utils/diffMap';
import serveMenus from '../services/menus';
import serveInfo from '../services/info';
import Paragraphs from '../components/Paragraphs';
import Drawer from '../components/Drawer';
import { Book } from '../db/BookSchema';
import { RefreshControl } from 'react-native';

interface RateOfProgress {
  menuId: number;
  top: number;
}

interface Params {
  url?: string;
  bid: number;
  rateOfProgress?: RateOfProgress;
}

interface IProps extends StackScreenProps<any> {}

interface IState {
  menus: Menu[];
  currentMenu: number;
  articleTop: number;
  articleContext: string[];
  refreshing: boolean;
}

type MenuItemProps = {
  title: string;
  read: boolean;
  index: number;
  active?: boolean;
  onPress(): void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  title = '',
  index,
  read = false,
  active = false,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          ...styles.menu,
          ...(active ? styles.active : {}),
        }}
      >
        {read ? '◉' : '◔'} {index} {title}
      </Text>
    </TouchableOpacity>
  );
};

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
      Alert.alert('有新的更新');
      const diffListOfMap = diffMap(
        arr2obj(local, 'mid'),
        arr2obj(remote, 'mid'),
      );

      const diffListOfArray: Menu[] = [];
      diffListOfMap.forEach(value => {
        diffListOfArray.push(value);
      });
      const storage = filterData(diffListOfArray);
      // console.log('入库数据', storage, 'storage end-----------------');r
      createHandel(storage);
      resolve(local.concat(storage));
    } else {
      resolve(local);
    }
  });
};

class ReadView extends React.Component<IProps, IState> {
  static contextType = MainContext;
  menusRef = React.createRef<FlatList<any>>();
  articleRef = React.createRef<ScrollView>();

  constructor(props: IProps, context: MainContextProps) {
    super(props, context);

    this.state = {
      menus: [],
      currentMenu: 0,
      articleTop: 0,

      articleContext: [],

      refreshing: false,
    };
  }

  async componentDidMount() {
    // 获取menus数据
    const { menus, index, top } = await this.getMenu();
    // 获取文章数据
    this.setMenu(menus, index, top);

    this.getArticleContext(menus[index].url);

    setTimeout(() => {
      console.log('------', index, top);
      this.menusRef.current?.scrollToIndex({ index });
      this.articleRef.current?.scrollTo({ y: top });
    }, 0);
  }

  // 获取menus数据，包含差异入库操作
  getMenu = (): Promise<{
    menus: Menu[];
    index: number;
    top: number;
  }> => {
    const { route } = this.props;
    const { url, bid, rateOfProgress } = route.params as Params;
    return new Promise(resolve => {
      if (url) {
        // 判断来源是否是个人中心
        if (rateOfProgress) {
          Promise.all([
            this.getDataFromDB(bid),
            serveMenus(url, bid),
            this.getBookInfoFromDb(bid),
          ]).then(([dbList, webList, book]) => {
            formatData(dbList, webList, this.createMenus).then(res => {
              // 滚动到已读位置
              const index = res.findIndex(
                v => v.mid === book.rateOfProgressMenuId,
              );
              resolve({
                menus: res,
                index: index < 0 ? 0 : index,
                top: book.rateOfProgressTop,
              });
            });
          });
        } else {
          serveMenus(url).then(res => {
            resolve({
              menus: res,
              index: 0,
              top: 0,
            });
          });
        }
      }
    });
  };

  getArticleContext = (url: string) => {
    serveInfo(url).then(article => {
      this.setState({ articleContext: article });
    });
  };

  // menu入库
  createMenus = (menus: Menu[]): void => {
    const { context } = this;
    context.store.create('Menu', menus);
  };

  setMenu = (menus: Menu[], currentMenu: number, top: number) => {
    this.setState({
      menus,
      currentMenu,
      articleTop: top,
    });
  };

  getDataFromDB = (bid: number): Promise<Menu[]> => {
    const { store } = this.context;
    return new Promise(resolve => {
      try {
        const menus = store.search('Menu');
        const menusByBid = menus.filtered(`bid=${bid}`).sorted('menuSort');
        resolve(menusByBid.toJSON() || []);
      } catch (err) {
        console.warn(err, '--getDateFormDB--');
        resolve([]);
      }
    });
  };

  getBookInfoFromDb = (bid: number): Promise<Book> => {
    const { store } = this.context;
    return new Promise(resolve => {
      const book = store.search('Book').filtered(`bid=${bid}`)[0];
      resolve(book.toJSON());
    });
  };

  setRateOfProgress = (mid: number, top: number, title: string) => {
    const { context } = this;
    const { route, navigation } = this.props;
    const { bid, rateOfProgress } = route.params as Params;

    // 设置标题
    navigation.setOptions({ title });

    if (rateOfProgress) {
      context.store.update('Book', 'bid', bid, {
        rateOfProgressTop: top,
        rateOfProgressMenuId: mid,
      });
    }
  };

  // 滚动结束后插入数据库位置
  inPutStorage = (top: number) => {
    const { menus, currentMenu } = this.state;
    const menu = menus[currentMenu];
    this.setRateOfProgress(menu.mid, top, menu.title);
  };

  // 上一页
  prevChapter = () => {
    const { menus, currentMenu } = this.state;
    if (currentMenu === 0) {
      return Alert.alert('已经是第一章了');
    }
    const current = currentMenu - 1;
    const menu = menus[current];
    this.getArticleContext(menu.url);
    // 更改内部状态
    const top = 9999;
    this.setState({
      currentMenu: current,
      articleTop: top,
    });
    setTimeout(() => {
      this.setRateOfProgress(menu.mid, top, menu.title);
      this.articleRef.current?.scrollToEnd({ animated: false });
    }, 0);
  };

  // 下一页
  nextChapter = () => {
    const { menus, currentMenu } = this.state;
    if (currentMenu + 1 >= menus.length) {
      return Alert.alert('已经木有啦');
    }
    const current = currentMenu + 1;
    const menu = menus[current];
    this.setState({
      currentMenu: current,
      articleTop: 0,
    });
    this.loadNext(menu.mid, menu.url, menu.title);
  };

  loadNext = (mid: number, url: string, title: string) => {
    const top = 0;
    this.getArticleContext(url);
    this.setRateOfProgress(mid, top, title);
    setTimeout(() => {
      this.articleRef.current?.scrollTo({
        y: top,
        animated: false,
      });
    }, 0);
  };

  // scroll 滚动结束事件
  onScrollEndDrag = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = ev;
    const scrollTop = Math.floor(nativeEvent.contentOffset.y);
    const height = Math.floor(nativeEvent.contentSize.height);
    const viewHeight = Math.floor(nativeEvent.layoutMeasurement.height);

    this.inPutStorage(scrollTop);

    console.log(scrollTop, viewHeight, height);

    if (scrollTop === 0) {
      this.prevChapter();
      console.log('到顶了');
    } else if (scrollTop + viewHeight >= height) {
      // this.nextChapter();
      console.log('到底了');
    }
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 1000);
  };

  render() {
    const { menus, currentMenu, articleContext, refreshing } = this.state;
    return (
      <Drawer
        slot={
          <FlatList
            ref={this.menusRef}
            keyExtractor={item => `${item.mid}`}
            data={menus}
            getItemLayout={(param, index) => ({
              length: 24,
              offset: 24 * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <MenuItem
                title={item.title}
                active={index === currentMenu}
                read={item.read}
                index={index}
                onPress={() => {
                  this.loadNext(item.mid, item.url, item.title);
                  this.setState({
                    currentMenu: index,
                    articleTop: 0,
                  });
                }}
              />
            )}
          />
        }
      >
        <View>
          <ScrollView
            ref={this.articleRef}
            onScrollEndDrag={this.onScrollEndDrag}
            overScrollMode="always"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            <Text>{menus[currentMenu]?.title}</Text>
            {articleContext.map((v, i) => (
              <Paragraphs key={`${menus[currentMenu]?.mid}-${i}`} text={v} />
            ))}
            <Button title="下一篇" onPress={this.nextChapter} />
          </ScrollView>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    height: 24,
    color: '#333',
  },
  active: {
    color: '#f00',
  },
});

export default ReadView;
