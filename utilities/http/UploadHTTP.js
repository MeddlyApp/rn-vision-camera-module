import axios from 'axios';

const uploadImage = async (config, payload, onUploadProgress) => {
  const {url, headers, nameConvention} = config;
  const {data, timestamp_start} = payload;
  const name = `${
    nameConvention ? `${nameConvention}_TS` : null
  }${timestamp_start}.jpg`;

  const file = {
    uri: data,
    name: name,
    type: 'image/jpg',
  };

  const formData = new FormData();
  formData.append('file', file);

  console.log('Image Upload: Starting...');

  return await uploadFile(formData, url, headers, onUploadProgress);
};

const uploadVideo = async (config, payload, onUploadProgress) => {
  const {url, headers, nameConvention} = config;
  const {data, timestamp_start} = payload;
  const name = `${
    nameConvention ? `${nameConvention}_TS` : null
  }${timestamp_start}.mp4`;

  const file = {
    uri: data,
    name: name,
    type: 'video/mp4',
  };

  const formData = new FormData();
  formData.append('file', file);

  // console.log('Video Upload: Starting...');

  return await uploadFile(formData, url, headers, onUploadProgress);
};

const uploadFile = async (formData, url, headers, onUploadProgress) => {
  // console.log('FORM_DATA', formData);
  // console.log('URL', url);
  console.log('HEADERS', headers);
  return new Promise(resolve => {
    axios({
      url: url,
      method: 'POST',
      headers: headers,
      data: formData,
      onUploadProgress: ({total, loaded}) => {
        const progress = (loaded / total) * 100;
        const percentage = Math.round(progress);
        if (onUploadProgress) {
          return onUploadProgress(percentage);
        }
        return console.log('Uploading_File...', percentage, '%');
      },
    })
      .then(res => resolve(res))
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
