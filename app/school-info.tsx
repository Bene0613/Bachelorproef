import { StyleSheet, Text, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function SchoolInfoScreen() {
  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Schoolinformatie"
      />

      <SectionHeader title="Schoolinformatie" />

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Row
            label="Naam school:"
            value="Sint–Guido Instituut"
          />

          <Row
            label="Adres:"
            value="Ninoofsesteenweg 369, Brussel"
          />

          <Row
            label="Telefoon:"
            value="02 526 87 04"
          />

          <Row
            label="E-mail:"
            value="directie.ns@sintguido.be"
          />

          <Row
            label="Schoolportaal:"
            value="sgiSmartschool.be"
          />

          <Row
            label="Schooltype:"
            value="Secundair onderwijs"
          />
        </View>
      </View>

      <BottomNav />
    </View>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

      <Text style={styles.navActive}>
        ⚙{"\n"}Meer
      </Text>
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

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 22,
  },

  row: {
    flexDirection: "row",
    marginBottom: 14,
  },

  rowLabel: {
    width: 120,
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },

  rowValue: {
    flex: 1,
    fontSize: 13,
    color: "#555",
  },

  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    color: "#6BCB59",
    fontSize: 22,
  },

  navActive: {
    color: "#6BCB59",
    fontSize: 12,
    textAlign: "center",
  },
});