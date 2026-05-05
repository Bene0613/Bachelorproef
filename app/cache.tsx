import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#EAF6E5", "#FFF9FC"]} style={styles.header}>
        <Text style={styles.title}>Instellingen</Text>
        <Text style={styles.breadcrumb}>
          Instellingen / <Text style={styles.green}>Cache wissen</Text>
        </Text>
        <View style={styles.line} />
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.headerBox}>Cache wissen</Text>

        <Text style={styles.text}>
          Door de cache te wissen, worden alle door jou gemaakte modules, opdrachten en tijdelijke bestanden in de app verwijderd.
          Wat er gebeurt:
          Opgeslagen oefeningen en modules worden verwijderd
          Eventuele voortgang die nog niet is opgeslagen, gaat verloren
          De app wordt opgeschoond en kan sneller werken
          Wat er niet gebeurt:
          Jouw accountgegevens (zoals naam of e-mailadres) blijven behouden
          Geüploade PDF’s buiten de app blijven veilig
          Tip: Wis de cache alleen als je modules opnieuw wilt starten of problemen ervaart.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF9FC" },

  header: { paddingTop: 28 },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#777",
  },

  breadcrumb: {
    textAlign: "center",
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },

  green: { color: "#5CBC4F" },

  line: {
    height: 3,
    backgroundColor: "#6BCB59",
    marginTop: 6,
  },

  card: {
    margin: 24,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },

  headerBox: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  text: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },

  small: {
    fontSize: 11,
    color: "#555",
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
  },

  button: {
    marginTop: 16,
    backgroundColor: "#5CBC4F",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "600" },

  link: {
    color: "#5CBC4F",
    marginVertical: 10,
  },
});