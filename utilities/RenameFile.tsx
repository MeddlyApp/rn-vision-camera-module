const RNFS = require('react-native-fs');

interface File {
  path: string;
}

export default async function renameFile(file: File, newName: string) {
  const {path} = file;
  const filename = path.replace(/^.*[\\\/]/, '');
  const ext = path.split('.').pop();
  const newPath = path.replace(filename, `${newName}.${ext}`);
  RNFS.moveFile(path, newPath);
  return newPath;
}
