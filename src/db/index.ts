import Realm, { ObjectSchema } from 'realm';
import ArticleSchema from './ArticleSchema';
import BookSchema from './BookSchema';
import MenuSchema from './MenuSchema';

console.log(Realm.defaultPath);

export class Store {
  db: Realm;
  constructor(schema: ObjectSchema[]) {
    this.db = new Realm({
      schema,
    });
  }
  search<T>(params: string) {
    return this.db.objects<T>(params);
  }
  create(tableName: string, value: object | object[]) {
    const realm = this.db;
    return realm.write(() => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          realm.create(tableName, item);
        });
      } else {
        realm.create(tableName, value);
      }
    });
  }
}

const store = new Store([ArticleSchema, MenuSchema, BookSchema]);

export default store;
