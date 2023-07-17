import React, { FC, useEffect, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, PressableProps } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ImageBody } from '../../../services/types';

const MAX_IMAGE_HEIGHT = Dimensions.get('window').height * 0.3;
const MAX_IMAGE_WIDTH = Dimensions.get('window').width * 0.6;

const ImageMsg: FC<{ imageBody: ImageBody } & PressableProps> = ({
  imageBody,
  ...pressableProps
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    Image.getSize(imageBody.url, (width, height) => {
      if (width > MAX_IMAGE_WIDTH) {
        const tempHeight = height * (MAX_IMAGE_WIDTH / width);
        console.log(tempHeight, MAX_IMAGE_HEIGHT);

        setSize({
          width: MAX_IMAGE_WIDTH,
          height: tempHeight > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT : tempHeight,
        });
      } else if (height > MAX_IMAGE_HEIGHT) {
        const tempWidth = width * (MAX_IMAGE_HEIGHT / height);
        setSize({
          height: MAX_IMAGE_HEIGHT,
          width: tempWidth > MAX_IMAGE_WIDTH ? MAX_IMAGE_HEIGHT : tempWidth,
        });
      } else {
        setSize({
          width,
          height,
        });
      }
    });
  }, []);

  return (
    <Pressable
      {...pressableProps}
      onPress={() => {
        setImageViewerVisible(true);
      }}
    >
      <Image source={{ uri: imageBody.url, ...size }} borderRadius={5} />
      <Modal visible={imageViewerVisible} transparent>
        <ImageViewer
          useNativeDriver
          backgroundColor="#00000099"
          onClick={() => {
            setImageViewerVisible(false);
          }}
          imageUrls={[{ url: imageBody.url }]}
        />
      </Modal>
    </Pressable>
  );
};

export default ImageMsg;
