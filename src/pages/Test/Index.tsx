import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigator/Stack';
import useUserStore from '../../stores/useUserStore';
import { Alert, Button, Image, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { chatWebSocket } from '../../hooks/useWebsocket';

const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const { user, setToken, getToken, initUser, logout } = useUserStore();
  const [input, setInput] = useState('');
  const [websocketState, setWebsocketState] = useState(false);

  const offset = useSharedValue(0);
  useEffect(() => {
    setInput(getToken() || '');
    // (async () => {
    //   const result = await await RNFetchBlob.fs.ls(path);
    //   setUrls(result);
    // })();
    // RNFetchBlob.config({
    //   path: path + `/cached.png`,
    // })
    //   .fetch('GET', TEST_IMAGE_URL)
    //   .progress((r, t) => {
    //     console.log('进度', r, t);
    //   })
    //   .then(async (res) => {
    //     console.log('已经保存到', res.path());
    //     setBase64(`data:image/png;base64,${res.base64()}`);
    //   })
    //   .catch((e) => {
    //     console.log('失败', e);
    //   });
  }, []);

  const handleTokenInput = () => {
    setToken(input);
    Alert.alert('设置完毕，请重启应用');
  };

  useEffect(() => {
    setInterval(() => {
      setWebsocketState(!chatWebSocket.isClosed());
    }, 5000);
    // 读取相册
    // CameraRoll.getPhotos({ first: 20, assetType: 'Photos' })
    //   .then((res) => {
    //     console.log(res);
    //     setPhotos(res.edges);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }, []);

  const gesture = Gesture.Pan()
    .onBegin(() => {})
    .onUpdate((e) => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad / Math.PI) * 180;
      const P = 60 / 50;
      const y = toDeg(Math.atan(toRad(e.translationY * P))) * (1 / P);
      offset.value = y;
    })
    .onEnd(() => {
      offset.value = withTiming(0);
    })
    .onFinalize(() => {});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: offset.value,
      },
    ],
  }));

  const renderWebsocketState = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>websocket状态</Text>
        <View
          style={{
            borderRadius: 10,
            width: 10,
            height: 10,
            backgroundColor: websocketState ? 'green' : 'red',
          }}
        />
      </View>
    );
  };

  const renderUserInfo = () => {
    if (!user) {
      return (
        <Text style={{ marginTop: 20 }}>
          {getToken() ? '请检查token是否有误' : '登陆请从网页端浏览器调试器中找到token并输入'}
        </Text>
      );
    }

    return (
      <View>
        <Image source={{ uri: user.avatar }} style={{ height: 100, width: 100 }}></Image>
        <Text>{`
        用户名:${user.name}
        uid: ${user.uid}
      `}</Text>
      </View>
    );
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          { alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 },
          animatedStyle,
        ]}
      >
        {renderUserInfo()}
        {renderWebsocketState()}
        <Text>当前token:</Text>
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: 'gray',
            margin: 10,
            borderRadius: 5,
            height: 40,
          }}
          placeholder="请输入token"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <Button onPress={handleTokenInput} title="确认" />
        <Button
          onPress={() => {
            logout();
            Alert.alert('请重启应用退出账号');
          }}
          title="退出登陆"
        />
        {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {urls.map((_) => (
            <Text key={_}>{urls}</Text>
          ))}
          {photos.map((_) => (
            <Image source={{ uri: _.node.image.uri, width: 100, height: 100 }}></Image>
          ))}
        </View> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default gestureHandlerRootHOC(Test);
