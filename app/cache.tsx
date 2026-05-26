import { StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function Screen() {
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
            Door de cache te wissen, worden alle door jou gemaakte modules,
            opdrachten en tijdelijke bestanden in de app verwijderd.
            {"\n\n"}
            Wat er gebeurt:
            {"\n"}
            • Opgeslagen oefeningen en modules worden verwijderd
            {"\n"}
            • Niet-opgeslagen voortgang gaat verloren
            {"\n"}
            • De app wordt opgeschoond en kan sneller werken
            {"\n\n"}
            Wat er niet gebeurt:
            {"\n"}
            • Accountgegevens blijven behouden
            {"\n"}
            • Geüploade PDF’s buiten de app blijven veilig
            {"\n\n"}
            Tip:
            {"\n"}
            Wis de cache alleen als je modules opnieuw wilt starten of problemen ervaart.
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
});