import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      router.replace("/modules" as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#FFFDF5", "#F1FFD8"]}
      style={styles.screen}
    >
      <View style={styles.loaderBox}>
        <Animated.View
          style={[
            styles.ring,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.cutout} />
        </Animated.View>

        <Image
          source={require("../../assets/images/FINAL-LOGO.png")}
          style={styles.logo}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    width: 190,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 26,
    borderTopColor: "#5B9C4A",
    borderRightColor: "#D9D948",
    borderBottomColor: "#5B9C4A",
    borderLeftColor: "#D9D948",
    position: "absolute",
  },
  cutout: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFFDF5",
    top: 10,
    left: 10,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
});