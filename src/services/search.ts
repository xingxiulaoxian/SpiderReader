import api from '../api';
import cheerio, { Cheerio, Element } from 'cheerio';
import createUUID from '../utils/createUUID';
import dayjs from 'dayjs';
import { Book } from '../db/BookSchema';

class BookClass implements Book {
  bid = 0;
  name = '';
  url = '';
  author = '';
  status = 0;
  length = '';
  lastUpdateTime = null;
  lastUpdateTitle = '';
  lastUpdateTitleUrl = '';
  rateOfProgressMenuId = 0;
  rateOfProgressTop = 0;
}

/**
 * 数据映射为Book类型
 * @param index number
 * @param $dom
 * @param book
 */
function tdsMapBook(
  index: number,
  $dom: Cheerio<Element>,
  book: Book,
  base: string,
) {
  switch (index) {
    case 0:
      book.name = $dom.text();
      book.url = `${base}${$dom.find('a').attr('href') || ''}`;
      break;
    case 1:
      book.lastUpdateTitle = $dom.text();
      book.lastUpdateTitleUrl = `${base}${$dom.find('a').attr('href') || ''}`;
      break;
    case 2:
      book.author = $dom.text();
      break;
    case 3:
      book.length = $dom.text();
      break;
    case 4:
      book.lastUpdateTime = dayjs($dom.text()).toDate();
      break;
    case 5:
      book.status = $dom.text() !== '完结' ? 0 : 1;
      // 最后一列的时候根据标题和作者设置bid
      book.bid = createUUID(`${book.name}-${book.author}`);
      break;
  }
}

/**
 * 解析字符串为json数据
 * @param html
 * @returns Article[]
 */
function parseHtml(html: string, base: string): Book[] {
  const $ = cheerio.load(html);
  const list: Cheerio<Book> = $('table.grid tr:not(:first-child)').map(
    function (i, el) {
      const book = new BookClass();
      $(el)
        .find('td')
        .each(function (index, ele) {
          tdsMapBook(index, $(ele), book, base);
        });
      return book;
    },
  );
  return [...list];
}

/**
 * 搜索服务
 * @param platform
 * @param keyWord
 * @returns
 */
export default function search(
  platform: number = 0,
  keyWord: string,
): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    const { base, search: _search } = api[platform];

    fetch(`${base}${_search}?searchkey=${keyWord}`)
      .then(res => res.text())
      .then(res => {
        const list = parseHtml(res, base);
        resolve(list);
      })
      .catch(err => {
        reject(err);
      });
  });
}
