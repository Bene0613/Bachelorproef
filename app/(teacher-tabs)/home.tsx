import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";

const API_URL = "https://bachelorproef-4946.onrender.com";

export default function HomeScreen() {
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState("5.2");
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const formData = new FormData();

    if (file.uri.startsWith("blob:")) {
      const blob = await fetch(file.uri).then((res) => res.blob());
      formData.append("file", blob, file.name || "document.pdf");
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
      } as any);
    }

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload mislukt");
      }

      setUploadId(data.uploadId);
      setFileName(file.name || "PDF gekozen");
    } catch (error) {
      console.log(error);
      alert(String(error));
    }
  };

  return (
    <View style={styles.screen}>
      <PageHeader title="Welkom" />

      <SectionHeader title="Vragen genereren" />

      <Text style={styles.subtitle}>
        Upload lesmateriaal en laat AI oefenvragen maken.
      </Text>

      <Pressable
        onPress={pickFile}
        style={({ pressed }) => [
          styles.uploadBox,
          pressed && { opacity: 0.7 },
        ]}
      >
        <View style={styles.folderTab}>
          <Text style={styles.tabText}>PDF</Text>
        </View>

        <Text style={styles.uploadText}>
          {fileName || "Verkenner openen"}
        </Text>
      </Pressable>

      <Text style={styles.versionTitle}>Kies een versie:</Text>

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
        onPress={() => {
          if (!uploadId) {
            alert("Kies eerst een PDF-bestand");
            return;
          }

          router.push({
            pathname: "/create-module",
            params: {
              uploadId,
              selectedModel,
            },
          } as any);
        }}
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
  },

  subtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 24,
    paddingHorizontal: 26,
  },

  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: "#6BCB59",
    borderBottomColor: "#F0D800",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 26,
    marginBottom: 34,
    position: "relative",
    backgroundColor: "#fff",
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
    marginHorizontal: 42,
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