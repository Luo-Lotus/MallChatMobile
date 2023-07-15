import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * 因为fabric不支持layout animation 所以手动封装一个
 * @param onEnterOver 进入动画结束回调
 * @param onExitOver 离开动画结束回调
 */
const useFadeLayoutAnimation = () => {
  const sharedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(sharedValue.value, [0, 1, -1], [0, 1, 0]);
    const translateY = interpolate(sharedValue.value, [0, 1, -1], [-40, 0, 40]);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const startEnter = (onEnterOver?: () => void) =>
    (sharedValue.value = withSpring(
      1,
      {
        duration: 200,
      },
      () => {
        onEnterOver && runOnJS(onEnterOver);
      },
    ));

  const startExit = (onExitOver?: () => void) =>
    (sharedValue.value = withTiming(
      -1,
      {
        duration: 200,
      },
      () => {
        onExitOver && runOnJS(onExitOver)();
      },
    ));

  return {
    animatedStyle,
    sharedValue,
    startEnter,
    startExit,
  };
};

export default useFadeLayoutAnimation;
