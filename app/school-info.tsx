import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SchoolInfoScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Instellingen</Text>
      <Text style={styles.breadcrumb}>Instellingen / <Text style={styles.green}>Schoolinformatie</Text></Text>
      <View style={styles.greenLine} />

      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Schoolinformatie</Text>
      </View>

      <View style={styles.infoCard}>
        <Row label="Naam school:" value="Sint–Guido Instituut" />
        <Row label="Adres:" value="Ninoofsesteenweg 369, Brussel" />
        <Row label="Telefoon:" value="02 526 87 04" />
        <Row label="E-mail:" value="directie.ns@sintguido.be" />
        <Row label="Schoolportaal:" value="sgiSmartschool.be" />
        <Row label="Schooltype:" value="Secundair onderwijs" />
      </View>

      <BottomNav />
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function BottomNav() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.navItem}>⌂</Text>
      <Text style={styles.navItem}>▦</Text>
      <Text style={styles.navItem}>□</Text>
      <Text style={styles.navActive}>⚙{"\n"}Meer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF9FC", paddingTop: 30, paddingHorizontal: 26 },
  time: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
  title: { textAlign: "center", fontSize: 26, fontWeight: "700", color: "#777" },
  breadcrumb: { textAlign: "center", fontSize: 11, color: "#555", marginTop: 2 },
  green: { color: "#5CBC4F" },
  greenLine: { height: 3, backgroundColor: "#6BCB59", marginHorizontal: -26, marginTop: 4, marginBottom: 22 },
  headerBox: { height: 46, backgroundColor: "#fff", borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 46 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#444" },
  infoCard: { backgroundColor: "#fff", borderRadius: 8, padding: 22 },
  row: { flexDirection: "row", marginBottom: 12 },
  rowLabel: { width: 120, fontSize: 13, color: "#555" },
  rowValue: { flex: 1, fontSize: 13, color: "#555" },
  navbar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 64, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  navItem: { color: "#6BCB59", fontSize: 22 },
  navActive: { color: "#6BCB59", fontSize: 12, textAlign: "center" },
});