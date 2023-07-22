import React, { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from './Toast';

export const ToastContext = createContext({});

const eventQueen: ((toast: ToastType) => void)[] = [];

export type ToastType = {
  message: string;
  type: 'normal';
};

export const TOAST_ANIMATION_MS = 500;

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toastQueen, setToastQueen] = useState<ToastType[]>([]);

  useEffect(() => {
    eventQueen.push(handleShowToast);
    return () => {
      eventQueen.pop();
    };
  }, []);

  const handleShowToast = (toast: ToastType) => {
    setToastQueen(toastQueen.concat(toast));
    setTimeout(() => {
      setToastQueen((value) => value.filter((item) => item !== toast));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={1}>
      <View
        style={{
          position: 'absolute',
          zIndex: 99999,
          left: 0,
          right: 0,
          marginTop: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {toastQueen.map((toast) => (
          <Toast key={toast.message} {...toast} />
        ))}
      </View>
      {children}
    </ToastContext.Provider>
  );
};

export const showToast = (toastConfig: ToastType) => {
  eventQueen.forEach((fn) => fn(toastConfig));
};
