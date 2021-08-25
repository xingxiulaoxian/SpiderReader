const exec = require('child_process').exec;
const path = require('path');

const androidPath = path.resolve(__dirname, '../android');
console.log(androidPath);
const child = exec(
  'sh ./gradlew assembleRelease',
  {
    cwd: androidPath,
    stdio: 'ignore',
    detached: true,
  },
  // function (error, stdout, stderr) {
  //   console.log(error, stdout, stderr);
  // },
);

child.unref();

child.stdout.on('data', function (data) {
  console.log(data.toString());
});
