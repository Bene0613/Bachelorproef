import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function Screen() {
  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Wachtwoord wijzigen"
      />

      <SectionHeader title="Wachtwoord wijzigen" />

      <View style={styles.content}>
        <Text style={styles.small}>
          Voer uw e-mailadres in, we sturen instructies om uw wachtwoord opnieuw in te stellen.
        </Text>

        <Text style={styles.label}>Schoolmail</Text>

        <TextInput
          style={styles.input}
          placeholder="naam@schoolnaam.be"
          placeholderTextColor="#999"
        />

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Ga verder</Text>
        </Pressable>
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

  small: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    color: "#555",
    marginBottom: 7,
  },

  input: {
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#333",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#5CBC4F",
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});