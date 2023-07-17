import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigator/Stack';
import useUserStore from '../../stores/useUserStore';
import {
  Alert,
  Button,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Gesture, GestureDetector, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

const TEST_IMAGE_URL =
  'https://minio.mallchat.cn/mallchat/chat/2023-07/10379/f88cbfb6-088f-44db-be5c-5ec04bda8b56.jpeg';

const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const { user, setToken, getToken, initUser, logout } = useUserStore();
  const [input, setInput] = useState('');
  const [base64, setBase64] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const offset = useSharedValue(0);
  useEffect(() => {
    setInput(getToken() || '');

    const path = RNFetchBlob.fs.dirs.MainBundleDir + '/files/cached';

    (async () => {
      const result = await await RNFetchBlob.fs.ls(path);
      setUrls(result);
    })();
    RNFetchBlob.config({
      path: path + `/cached.png`,
    })
      .fetch('GET', TEST_IMAGE_URL)
      .progress((r, t) => {
        console.log('进度', r, t);
      })
      .then(async (res) => {
        console.log('已经保存到', res.path());
        setBase64(`data:image/png;base64,${res.base64()}`);
      })
      .catch((e) => {
        console.log('失败', e);
      });
  }, []);

  const handleTokenInput = () => {
    setToken(input);
    Alert.alert('设置完毕，请重启应用');
  };

  useEffect(() => {
    CameraRoll.getPhotos({ first: 20, assetType: 'Photos' })
      .then((res) => {
        console.log(res);
        setPhotos(res.edges);
      })
      .catch((e) => {
        console.log(e);
      });
    // async function hasAndroidPermission() {
    //   const getCheckPermissionPromise = () => {
    //     if (Platform.Version >= 33) {
    //       return Promise.all([
    //         PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
    //         PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
    //       ]).then(
    //         ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
    //           hasReadMediaImagesPermission && hasReadMediaVideoPermission,
    //       );
    //     } else {
    //       return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    //     }
    //   };

    //   const hasPermission = await getCheckPermissionPromise();
    //   if (hasPermission) {
    //     return true;
    //   }
    //   const getRequestPermissionPromise = () => {
    //     if (Platform.Version >= 33) {
    //       return PermissionsAndroid.requestMultiple([
    //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    //       ]).then(
    //         (statuses) =>
    //           statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
    //             PermissionsAndroid.RESULTS.GRANTED &&
    //           statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
    //             PermissionsAndroid.RESULTS.GRANTED,
    //       );
    //     } else {
    //       return PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    //     }
    //   };

    //   return await getRequestPermissionPromise();
    // }
    // hasAndroidPermission();
  }, []);

  const renderUserInfo = () => {
    if (!user) {
      return (
        <Text>
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

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {renderUserInfo()}
        <Text>当前token:</Text>
        <TextInput
          style={{ borderWidth: 2, borderColor: 'gray', marginHorizontal: 20, borderRadius: 10 }}
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
        {urls.map((_) => (
          <Text key={_}>{urls}</Text>
        ))}
        {photos.map((_) => (
          <Image source={{ uri: _.node.image.uri, width: 100, height: 100 }}></Image>
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

export default gestureHandlerRootHOC(Test);
