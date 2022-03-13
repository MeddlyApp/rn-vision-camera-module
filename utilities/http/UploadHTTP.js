import axios from 'axios';

/*
let file = {
  uri: image.path,
  name: `${timestamp}.jpg`,
  type: image.mime,
}

// Image isn't needs tested
const uploadImage = async (payload, profile) => {
  const {data, timestamp_start} = payload;
  const profile = null;

  const name = 'img';
  const nameWithTimeStamp = name ? `${name}_TS-` : null;
  const file_name = `${nameWithTimeStamp}${timestamp_start}.mp4`;

  const uri = Platform.OS === 'android' ? `file://${data}` : data;
  const file = {
    name: file_name,
    uri: uri,
    type: image.mime,
  };

  const formData = new FormData();
  formData.append('file', file);
  console.log('Image Upload: Starting');
  const res = await uploadFile(formData, profile);
  if (res.status === 201) {
    console.log('Image Upload: Successfull', res.status);
  }
};
*/

// Tested
const uploadVideo = async (config, payload, onUploadProgress) => {
  const {url, authToken, nameConvention} = config;
  const {data, timestamp_start} = payload;

  const uri = Platform.OS === 'android' ? `file://${data}` : data;
  const file_name = nameConvention ? `${nameConvention}_TS-` : null;
  const name = `${file_name}${timestamp_start}.mp4`;

  const file = {uri, name, type: 'video/mp4'};
  const formData = new FormData();
  formData.append('file', file);

  console.log('Video Upload: Starting...');
  return await uploadFile(formData, url, authToken, onUploadProgress);
};

const uploadFile = async (formData, url, authToken, onUpload) => {
  const authorization = authToken
    ? {Authorization: `Bearer ${authToken}`, Accept: 'application/json'}
    : null;

  return new Promise(resolve => {
    axios({
      url: url,
      method: 'POST',
      headers: authorization,
      data: formData,
      onUploadProgress: ({total, loaded}) => {
        const progress = (loaded / total) * 100;
        const percentage = Math.round(progress);
        if (onUpload) {
          return () => onUpload(percentage);
        }
        return console.log('Uploading_File...: ', percentage, '%');
      },
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        console.log('Upload_Error: ', error);
        resolve(error);
      });
  });
};

const UploadHTTP = {
  uploadImage,
  uploadVideo,
};

export default UploadHTTP;
