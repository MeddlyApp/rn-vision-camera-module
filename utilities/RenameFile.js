var RNFS = require('react-native-fs');

export default async function renameFile(file, newName) {
  const {path} = file;
  const filename = path.replace(/^.*[\\\/]/, '');
  const ext = path.split('.').pop();
  const newPath = path.replace(filename, `${newName}.${ext}`);
  RNFS.moveFile(path, newPath);
  return newPath;
}
