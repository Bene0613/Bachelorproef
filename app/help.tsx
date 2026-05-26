import { Pressable, StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function Screen() {
  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Help & steun"
      />

      <SectionHeader title="Help & steun" />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.text}>
            Heb je vragen? Bekijk eerst onze FAQ op de website.
          </Text>

          <Pressable>
            <Text style={styles.link}>
              modulemind.be/faq
            </Text>
          </Pressable>

          <Text style={styles.text}>
            Staat je antwoord er niet tussen? Neem dan contact met ons op via:
          </Text>

          <Text style={styles.email}>
            info@modulemind.be
          </Text>
        </View>
      </View>
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

  link: {
    color: "#5CBC4F",
    marginVertical: 12,
    fontSize: 12,
    fontWeight: "700",
  },

  email: {
    marginTop: 10,
    color: "#5CBC4F",
    fontSize: 12,
    fontWeight: "700",
  },
});