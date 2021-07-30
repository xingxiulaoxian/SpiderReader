import cheerio from 'cheerio';
import cyrb53 from '../utils/cyrb53';

export interface MenusInterface {
  name: string;
  url: string;
  mid: number;
}
function parseHtml(html: string, base: string): MenusInterface[] {
  const $ = cheerio.load(html);
  const links = $('#list a') || '';
  const list = links.map((_i, el) => ({
    name: el.attribs.title,
    url: `${base}${el.attribs.href}`,
    mid: cyrb53(`${base}${el.attribs.href}`),
  }));

  return [...list];
}

export default function menus(url: string): Promise<MenusInterface[]> {
  return new Promise(resolve => {
    fetch(url)
      .then(res => res.text())
      .then(res => {
        const list = parseHtml(res, url);
        resolve(list);
      })
      .catch(_err => {
        console.log('获取数据失败');
        resolve([]);
      });
  });
}
