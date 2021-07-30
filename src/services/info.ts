import cheerio from 'cheerio';

function parseHtml(html: string): string[] {
  const $ = cheerio.load(html);
  const content = $('#content').html() || '';
  return content
    ?.replace(/(&nbsp;)/g, '')
    .replace(
      /(<!--go-->)|(\r)|(\n)|((&nbsp;))|(<br>)|(<br\/>)|(<br\s\/>)|(<!--over-->)/g,
      '__@@@__',
    )
    .split('__@@@__')
    .filter(v => !!v);
}

export default function info(url: string): Promise<string[]> {
  return new Promise(resolve => {
    const _url = url;
    fetch(_url)
      .then(res => res.text())
      .then(res => {
        const text = parseHtml(res);
        resolve(text);
      })
      .catch(_err => {
        console.log('获取数据失败');
        resolve([]);
      });
  });
}
