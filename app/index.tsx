import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  const rotate = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;

  const [showText, setShowText] = useState(false);

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: 4,
      duration: 2800,
      useNativeDriver: true,
    }).start(() => {
      setShowText(true);

      Animated.timing(fadeText, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        router.replace("/login" as any);
      }, 1600);
    });
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 4],
    outputRange: ["0deg", "1440deg"],
  });

  return (
    <LinearGradient colors={["#FFFDF5", "#F1FFD8"]} style={styles.screen}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <Animated.Image
        source={require("../assets/images/FINAL-LOGO.png")}
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
      />

      {showText && (
        <Animated.View style={{ opacity: fadeText }}>
          <Text style={styles.brand}>ModuleMind</Text>
          <Text style={styles.subtitle}>
            Train jouw brein met slimme modules.
          </Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: 76,
    height: 76,
    resizeMode: "contain",
    marginBottom: 10,
  },
  brand: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    color: "#5CBC4F",
    marginTop: 8,
    textAlign: "center",
  },
  circleTop: {
    position: "absolute",
    top: -60,
    right: -45,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#9DBD52",
  },
  circleBottom: {
    position: "absolute",
    bottom: -60,
    left: -45,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#C4CC55",
  },
});