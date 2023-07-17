import React, { FC, useEffect, useState } from 'react';
import { Dimensions, Image } from 'react-native';

const WIDTH = Dimensions.get('window').width * 0.4;

const Emoji: FC<{ url: string }> = ({ url }) => {
  const [size, setSize] = useState({ height: 0, width: 0 });
  useEffect(() => {
    Image.getSize(url, (width, height) => {
      if (width === height) {
        setSize({
          width: WIDTH,
          height: WIDTH,
        });
      } else if (height > width) {
        setSize({
          height: WIDTH,
          width: width * (WIDTH / height),
        });
      } else if (width > height) {
        setSize({
          width: WIDTH,
          height: height * (WIDTH / width),
        });
      }
    });
  }, []);
  return <Image source={{ uri: url, ...size }} borderRadius={5} />;
};

export default Emoji;
