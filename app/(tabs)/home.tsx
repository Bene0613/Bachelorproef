import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState("5.2");

  const pickFile = async () => {
    await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Welkom</Text>
      </LinearGradient>

      <View style={styles.greenLine} />

      <Text style={styles.subtitle}>
        Upload lesmateriaal en laat AI oefenvragen maken.
      </Text>

      {/* Upload box */}
      <Pressable
        onPress={pickFile}
        style={({ pressed }) => [
          styles.uploadBox,
          pressed && { opacity: 0.7 },
        ]}
      >
        <View style={styles.folderTab}>
          <Text style={styles.tabText}>Video’s</Text>
        </View>

        <Text style={styles.uploadText}>Verkenner Openen</Text>
      </Pressable>

      <Text style={styles.versionTitle}>Kies een versie:</Text>

      {/* AI 5.2 */}
      <Pressable
        style={[
          styles.aiCard,
          selectedModel === "5.2" && styles.aiCardActive,
        ]}
        onPress={() => setSelectedModel("5.2")}
      >
        <Image
          source={require("../../assets/images/ailogo.png")}
          style={styles.aiLogo}
        />
        <View>
          <Text style={styles.aiTitle}>OpenAI 5.2</Text>
          <Text style={styles.aiSubtitle}>Sneller & nauwkeuriger</Text>
        </View>
        <Text style={styles.badge}>Aanbevolen</Text>
      </Pressable>

      {/* AI 5.1 */}
      <Pressable
        style={[
          styles.aiCard,
          selectedModel === "5.1" && styles.aiCardActive,
        ]}
        onPress={() => setSelectedModel("5.1")}
      >
        <Image
          source={require("../../assets/images/ailogo.png")}
          style={styles.aiLogo}
        />
        <View>
          <Text style={styles.aiTitle}>OpenAI 5.1</Text>
          <Text style={styles.aiSubtitle}>Stabiel & lichtgewicht</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/create-module" as any)}
      >
        <Text style={styles.buttonText}>Vragen genereren</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
    paddingTop: 28,
    paddingHorizontal: 22,
  },
  header: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#777",
    fontFamily: "DMSans-Bold",
  },
  greenLine: {
    height: 3,
    backgroundColor: "#6BCB59",
    marginHorizontal: -22,
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 28,
  },
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: "#6BCB59",
    borderBottomColor: "#F0D800",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 34,
    position: "relative",
  },
  folderTab: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 120,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#CFE9C8",
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 11,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  versionTitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginBottom: 16,
  },
  aiCard: {
    height: 62,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  aiCardActive: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
  },
  aiLogo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 18,
  },
  aiTitle: {
    fontSize: 18,
    color: "#555",
  },
  aiSubtitle: {
    fontSize: 11,
    color: "#888",
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 4,
    backgroundColor: "#E5EE9C",
    borderRadius: 8,
    paddingHorizontal: 5,
    fontSize: 8,
    color: "#6E8B00",
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 7,
    marginTop: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});