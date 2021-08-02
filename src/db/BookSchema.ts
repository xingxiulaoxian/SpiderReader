import { ObjectSchema } from 'realm';

export interface Book {
  bid: number;
  name: string;
  url: string;
  author: string;
  /**
   * 0: 连载
   * 1: 完结
   * */
  status: number;
  length: string;
  lastUpdateTime: Date | null;
  lastUpdateTitle: string;
  lastUpdateTitleUrl: string;

  // 阅读进度
  rateOfProgressMenuId: number;
  rateOfProgressTop: number;
}

const BookSchema: ObjectSchema = {
  name: 'Book',
  primaryKey: 'bid',
  properties: {
    bid: 'int',
    name: 'string',
    url: 'string',
    author: 'string',
    // 0 连载中 1 完结
    status: 'int',
    // false 未收藏 true 收藏
    star: 'bool',
    length: 'string',
    lastUpdateTime: 'date',
    lastUpdateTitle: 'string',
    lastUpdateTitleUrl: 'string',
    // 阅读进度
    rateOfProgressMenuId: 'int',
    rateOfProgressTop: 'int',
  },
};

export default BookSchema;
