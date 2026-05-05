import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#EAF6E5", "#FFF9FC"]} style={styles.header}>
        <Text style={styles.title}>Instellingen</Text>
        <Text style={styles.breadcrumb}>
          Instellingen / <Text style={styles.green}>Help & steun</Text>
        </Text>
        <View style={styles.line} />
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.headerBox}>Help & steun</Text>

        <Text style={styles.text}>
          Heb je vragen? Bekijk eerst onze FAQ op de website.
        </Text>

        <Text style={styles.link}>https://hyenadesign.github.io/ModuleMindWebsite/index.html</Text>

        <Text style={styles.text}>
          Staat je antwoord er niet tussen? Neem dan contact met ons op via “ info@modulemind.be”
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