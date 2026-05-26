import { StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <PageHeader title="Dashboard" />

      <SectionHeader title="Overzicht" />

      <View style={styles.card}>
        <Text style={styles.text}>Je dashboard komt hier.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  card: {
    marginHorizontal: 26,
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
  },

  text: {
    fontSize: 13,
    color: "#555",
  },
});