import React, {
  FC,
  PropsWithChildren,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useClickOutside } from 'react-native-click-outside';
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated, {
  FadeInDown,
  FadeOutUp,
  enableLayoutAnimations,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useFadeLayoutAnimation from '../../hooks/animations/useFadeLayoutAnimation';
import Button from '../Button';

export type PopMenuItem = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
};

enableLayoutAnimations(true);

type IProps = PropsWithChildren<{
  pressableProps?: PressableProps;
  menus?: PopMenuItem[];
  style?: StyleProp<ViewStyle>;
  direction?: 'horizontal' | 'vertical';
}>;

const PopMenu: FC<IProps> = ({
  pressableProps,
  children,
  style,
  menus,
  direction = 'horizontal',
}) => {
  const [showPop, setShowPop] = useState(false);
  const containerRef = useRef<View>(null);
  const isPressing = useRef(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        popContainer: {
          position: 'relative',
          overflow: 'visible',
          alignItems: 'center',
        },
      }),
    [],
  );

  const handleLongPress = (event: GestureResponderEvent) => {
    setShowPop(true);
  };

  return (
    <>
      <View ref={containerRef} style={[style, styles.popContainer]}>
        <Button
          {...pressableProps}
          onLongPress={handleLongPress}
          onPressIn={() => {
            isPressing.current = true;
          }}
          onPressOut={() => {
            setTimeout(() => {
              isPressing.current = false;
            }, 0);
          }}
        >
          {children}
        </Button>

        {showPop && (
          <Menus
            direction={direction}
            menus={menus}
            onClose={() => setShowPop(false)}
            isPressing={isPressing}
            showPop={showPop}
          />
        )}
      </View>
    </>
  );
};

const Menus: FC<
  IProps & { onClose: () => void; isPressing: RefObject<boolean>; showPop: boolean }
> = ({ menus, onClose, isPressing }) => {
  const ref = useClickOutside(() => {
    if (!isPressing.current) {
      handleCloseMenuAnimation();
    }
  });
  const { animatedStyle, startEnter, startExit } = useFadeLayoutAnimation();

  useEffect(() => {
    startEnter();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        menuContainer: {
          flexDirection: 'row',
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: 10,
          top: -40,
          color: 'white',
        },
        menuItem: {
          paddingHorizontal: 10,
          paddingVertical: 10,
        },
        menuLabel: {
          color: 'black',
          fontSize: 16,
        },
      }),
    [],
  );

  const closeMenu = () => {
    onClose();
  };

  const handleCloseMenuAnimation = () => {
    startExit(closeMenu);
  };

  return (
    <Animated.View
      entering={FadeInDown.withCallback(() => {
        console.log(11);
      })}
      exiting={FadeOutUp}
      style={[styles.menuContainer, animatedStyle]}
      // @ts-ignore
      ref={ref}
    >
      {menus?.map((menu, index) => (
        <Button
          style={styles.menuItem}
          onPress={menu.onPress}
          onPressOut={handleCloseMenuAnimation}
          key={menu.label}
        >
          <View>
            {menu.icon}
            <Text style={styles.menuLabel}>{menu.label}</Text>
          </View>
        </Button>
      ))}
    </Animated.View>
  );
};

export default PopMenu;
