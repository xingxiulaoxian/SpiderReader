import controller from '../controller';

export default () => {
  return fetch(controller.home)
    .then(res => res.text())
    .then(res => {
      console.log(res);
    });
};
