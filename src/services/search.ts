import controller from '../controller';

export default function (keyWord: string) {
  fetch(`${controller.search}?searchkey=${keyWord}`).then(res => {
    console.log(res);
  });
}
