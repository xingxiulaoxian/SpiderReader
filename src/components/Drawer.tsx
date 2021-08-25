import React, { ReactNode, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import clickExtension from '../utils/clickExtension';

const width = Dimensions.get('window').width;

const Drawer: React.FC<{
  slot: ReactNode;
}> = ({ children, slot }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  const toggle = (val: number) => {
    Animated.timing(translateX, {
      toValue: val,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const show = () => toggle(0);
  // const show = clickExtension(() => toggle(0));
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...styles.left,
          transform: [{ translateX }],
        }}
      >
        <View style={styles.leftWrapper}>{slot}</View>
        <TouchableOpacity
          style={styles.leftActive}
          onPress={() => toggle(-width)}
        />
      </Animated.View>
      {/* <TouchableWithoutFeedback onPress={show}> */}
      <View style={styles.mainWrapper}>
        <View style={styles.main}>{children}</View>
        <View style={styles.toggleBtn}>
          <TouchableWithoutFeedback onPress={show}>
            <Text>{'>>'}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  leftWrapper: {
    flex: 6,
    backgroundColor: '#fff',
  },
  leftActive: {
    flex: 4,
  },
  mainWrapper: {
    position: 'relative',
    flex: 1,
  },
  main: {
    height: '100%',
    // backgroundColor: '#000',
  },
  toggleBtn: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    width: 30,
    height: 20,
    backgroundColor: '#666',
  },
  textContent: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    lineHeight: 20,
    color: '#f1f1f1',
  },
});

export default Drawer;
