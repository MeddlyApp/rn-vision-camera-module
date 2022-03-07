import React from 'react';
import PlethoraCamera from './PlethoraCamera';

export default function App(props) {
  // const [isVideo, setIsVideo] = useState(false);

  return (
    <PlethoraCamera
      saveToCameraRoll={true}
      onRecordingFinished={v => console.log('VIDEO_RECORDED', v)}
      onRecordingError={e => console.log('RECORDING_ERROR', e)}
      onTakePicture={p => console.log('PICTURE', p)}
    />
  );
}
