import api from '../api';
import cheerio, { Cheerio, Element } from 'cheerio';

export interface Article {
  title: string;
  url: string;
  author: string;
  status: string;
  length: string;
  lastTime: string;
  lastChapterName: string;
  lastChapterUrl: string;
}

class ArticleClass implements Article {
  title = '';
  url = '';
  author = '';
  status = '';
  length = '';
  lastTime = '';
  lastChapterName = '';
  lastChapterUrl = '';
}

/**
 * 数据映射为Article类型
 * @param index number
 * @param $dom
 * @param article
 */
function tdsMapArticle(
  index: number,
  $dom: Cheerio<Element>,
  article: Article,
  base: string,
) {
  switch (index) {
    case 0:
      article.title = $dom.text();
      article.url = `${base}${$dom.find('a').attr('href') || ''}`;
      break;
    case 1:
      article.lastChapterName = $dom.text();
      article.lastChapterUrl = `${base}${$dom.find('a').attr('href') || ''}`;
      break;
    case 2:
      article.author = $dom.text();
      break;
    case 3:
      article.length = $dom.text();
      break;
    case 4:
      article.lastTime = $dom.text();
      break;
    case 5:
      article.status = $dom.text();
      break;
  }
}

/**
 * 解析字符串为json数据
 * @param html
 * @returns Article[]
 */
function parseHtml(html: string, base: string): Article[] {
  const $ = cheerio.load(html);
  const list: Cheerio<Article> = $('table.grid tr').map(function (i, el) {
    const article: Article = new ArticleClass();
    $(el)
      .find('td')
      .each(function (index, ele) {
        tdsMapArticle(index, $(ele), article, base);
      });
    return article;
  });
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
): Promise<Article[]> {
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
