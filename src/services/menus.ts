import cheerio from 'cheerio';
import dayjs from 'dayjs';
import { Menu } from '../db/MenuSchema';
import createUUID from '../utils/createUUID';

function parseHtml(html: string, base: string, bid?: number): Menu[] {
  const $ = cheerio.load(html);
  const links = $('#list a') || '';

  let prevMid = 0,
    nextMid = 0;

  const list = links
    .map((i, el) => {
      const _prevMid = prevMid;
      // 当前的aid，用做下一次aid的值
      prevMid = createUUID(`${base}${el.attribs.href}`);
      return {
        bid: bid,
        mid: prevMid,
        title: el.attribs.title,
        url: `${base}${el.attribs.href}`,
        prevMid: _prevMid,
        nextMid: nextMid,
        menuSort: i,
        updateTime: dayjs().toDate(),
        read: false,
        local: false,
      };
    })
    .toArray();

  for (let index = list.length - 1; index > 0; index--) {
    const ele = list[index];
    const _nextMid = nextMid;
    nextMid = ele.mid;
    ele.nextMid = _nextMid;
  }
  return list;
}

export default function menus(url: string, bid?: number): Promise<Menu[]> {
  return new Promise(resolve => {
    fetch(url)
      .then(res => res.text())
      .then(res => {
        const list = parseHtml(res, url, bid);
        resolve(list);
      })
      .catch(_err => {
        console.log('menus获取数据失败', _err);
        resolve([]);
      });
  });
}
