import React, {
  FC,
  PropsWithChildren,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useClickOutside } from 'react-native-click-outside';
import Animated, { enableLayoutAnimations } from 'react-native-reanimated';
import useFadeLayoutAnimation from '../../hooks/animations/useFadeLayoutAnimation';
import Button, { IButtonProps } from '../Button';

export type PopMenuItem = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
};

enableLayoutAnimations(true);

type IProps = PropsWithChildren<{
  pressableProps?: IButtonProps;
  menus?: PopMenuItem[];
  style?: StyleProp<ViewStyle>;
  direction?: 'horizontal' | 'vertical';
  /** 如果为true，子组件需要为Pressable*/
  isChildrenPressable?: boolean;
}>;

const PopMenu: FC<IProps> = ({
  pressableProps,
  children,
  style,
  menus,
  direction = 'horizontal',
  isChildrenPressable = false,
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

  const handleLongPress = () => {
    setShowPop(true);
  };

  const pressable = React.cloneElement(
    isChildrenPressable ? (children as JSX.Element) : <Button />,
    {
      ...pressableProps,
      onLongPress: handleLongPress,
      onPressIn: () => {
        isPressing.current = true;
      },
      onPressOut: () => {
        setTimeout(() => {
          isPressing.current = false;
        }, 0);
      },
      children: children,
    },
  );

  return (
    <>
      <View ref={containerRef} style={[style, styles.popContainer]}>
        {pressable}
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
          top: -50,
          color: 'white',
        },
        menuItem: {
          padding: 5,
          paddingVertical: 10,
        },
        menuLabel: {
          color: 'black',
          fontSize: 14,
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
      style={[styles.menuContainer, animatedStyle]}
      // @ts-ignore
      ref={ref}
    >
      {menus?.map((menu, index) => (
        <Button
          style={[
            styles.menuItem,
            index === 0 ? { paddingLeft: 10 } : undefined,
            index === menus.length - 1 ? { paddingRight: 10 } : undefined,
          ]}
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
