import axios from 'axios';

/*
let file = {
  uri: image.path,
  name: `${timestamp}.jpg`,
  type: image.mime,
} 
*/

// Image isn't needs tested
const uploadImage = async payload => {
  const {data, timestamp_start} = payload;
  // const profile = null;

  const name = 'img';
  const nameWithTimeStamp = name ? `${name}_TS-` : null;
  const file_name = `${nameWithTimeStamp}${timestamp_start}.mp4`;

  const uri = Platform.OS === 'android' ? `file://${data}` : data;
  const file = {
    name: file_name,
    uri: uri,
    type: image.mime,
  };

  console.log('IMAGE_UPLOAD_REQUEST: Not set up');

  /*
  const formData = new FormData();
  formData.append('file', file);
  console.log('Image Upload: Starting');
  const res = await uploadFile(formData, profile);
  if (res.status === 201) {
    console.log('Image Upload: Successfull', res.status);
  }
  */
};

// Tested
const uploadVideo = async (config, payload, onUploadProgress) => {
  // console.log('CONFIG', config);
  // console.log('PAYLOAD', payload);
  // console.log('ONUPLOADPROGRESS', onUploadProgress);

  const {url, authToken, nameConvention} = config;
  const {data, timestamp_start} = payload;

  // const uri = Platform.OS === 'android' ? `${data}` : data;
  const name = `${
    nameConvention ? `${nameConvention}_TS-` : null
  }${timestamp_start}.mp4`;

  const file = {
    uri: data,
    name: name,
    type: 'video/mp4',
  };

  console.log('FILE_IS_HOW_IT_GOES', file);

  const formData = new FormData();
  formData.append('file', file);

  console.log('Video Upload: Starting...', formData);
  return await uploadFile(formData, url, authToken, onUploadProgress);
};

const uploadFile = async (formData, url, authToken, onUploadProgress) => {
  const authorization = authToken
    ? {Authorization: `Bearer ${authToken}`, Accept: 'application/json'}
    : null;

  // console.log('FORM_DATA', formData);
  return new Promise(resolve => {
    axios({
      url: url,
      method: 'POST',
      headers: authorization,
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
