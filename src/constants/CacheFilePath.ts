import { RNFetchBlob } from 'rn-fetch-blob';

const basePath = RNFetchBlob.fs.dirs.MainBundleDir;

export default {
  AUDIO_PATH: basePath + '/audio',
  VIDEO_PATH: basePath + '/video',
  IMAGE_PATH: basePath + '/image',
  FILE_PATH: basePath + '/file',
};
