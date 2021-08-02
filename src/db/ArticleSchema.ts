import { ObjectSchema } from 'realm';

export interface Article {
  /** menu id 指向父id */
  mid: number;
  /** 他自己的id 指向文章详情 */
  aid: number;
  /** 文章地址 */
  url: string;
  /** 文章内容 */
  content: string;
  /** local */
  local: boolean;
}

/** 章节标题和关系 */
const ArticleSchema: ObjectSchema = {
  name: 'Article',
  primaryKey: 'aid',
  properties: {
    mid: 'int',
    aid: 'int',
    url: 'string',
    content: 'string',
    local: 'bool',
  },
};

export default ArticleSchema;
