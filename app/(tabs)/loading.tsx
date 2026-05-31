import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rotate = useRef(new Animated.Value(0)).current;

  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  const text = Array.isArray(params.text) ? params.text[0] : params.text;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      router.replace((next || "/modules") as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, [next]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient colors={["#FFFDF5", "#F1FFD8"]} style={styles.screen}>
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

      <Text style={styles.loadingText}>
        {text || "Even geduld..."}
      </Text>
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

  loadingText: {
    marginTop: 18,
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
});