import { ObjectSchema } from 'realm';

export interface Menu {
  /** book id 指向父id */
  bid: number | undefined;
  /** 他自己的id */
  mid: number;
  /** 标题 */
  title: string;
  /** 文章地址 */
  url: string;
  /** 上一篇id */
  prevMid: number;
  /** 下一篇id */
  nextMid: number;
  /** 章节排序 */
  menuSort: number;
  /** 更新时间 */
  updateTime: Date | null;
  /** local 本地数据 */
  local: boolean;
  /** read 是否已读 默认false */
  read: boolean;
}

/** 章节标题和关系 */
const MenuSchema: ObjectSchema = {
  name: 'Menu',
  // 官方没给出自增长的办法,而且一般不会用到主键,这也解决了重复访问的问题,而且实际开发中我们不需要主键的,让服务端管就是了
  primaryKey: 'mid',
  properties: {
    bid: 'int',
    mid: 'int',
    title: 'string',
    url: 'string',
    prevMid: 'int',
    nextMid: 'int',
    menuSort: 'int',
    updateTime: 'date',
    local: 'bool',
    read: 'bool',
  },
};

export default MenuSchema;
