import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function Screen() {
  const [modalVisible, setModalVisible] = useState(false);

  const clearCache = () => {
    setModalVisible(false);
    alert("Cache gewist");
  };

  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Cache wissen"
      />

      <SectionHeader title="Cache wissen" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.text}>
            Door de cache te wissen, worden tijdelijke bestanden in de app
            verwijderd.
            {"\n\n"}
            Wat er gebeurt:
            {"\n"}
            • Niet-opgeslagen voortgang kan verloren gaan
            {"\n"}
            • De app wordt opgeschoond en kan sneller werken
            {"\n\n"}
            Wat er niet gebeurt:
            {"\n"}
            • Accountgegevens blijven behouden
            {"\n"}
            • Opgeslagen modules blijven behouden
            {"\n\n"}
            Tip:
            {"\n"}
            Wis de cache alleen als je problemen ervaart.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Doorgaan</Text>
          </Pressable>
        </View>
      </View>

      <ConfirmModal
        visible={modalVisible}
        title="Cache wissen?"
        message="Ben je zeker dat je de cache wilt wissen? Niet-opgeslagen voortgang kan verloren gaan."
        cancelText="Annuleren"
        confirmText="Wissen"
        destructive
        onCancel={() => setModalVisible(false)}
        onConfirm={clearCache}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  content: {
    paddingHorizontal: 26,
    paddingTop: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
  },

  text: {
    fontSize: 12,
    color: "#555",
    lineHeight: 20,
  },

  button: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: 24,
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});