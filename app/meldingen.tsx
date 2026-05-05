import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Instellingen</Text>
      <Text style={styles.breadcrumb}>Instellingen / <Text style={styles.green}>Meldingen</Text></Text>
      <View style={styles.greenLine} />

      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Meldingen</Text>
      </View>

      <SettingToggle
        label="Meldingen"
        value={notifications}
        onValueChange={setNotifications}
      />

      <SettingToggle
        label="Nieuwsbrieven"
        value={newsletter}
        onValueChange={setNewsletter}
      />

      <BottomNav />
    </View>
  );
}

function SettingToggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#8A8A8A", true: "#5CBC4F" }}
        thumbColor="#fff"
      />
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
  headerBox: { height: 46, backgroundColor: "#fff", borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 36 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#444" },
  toggleRow: { height: 42, backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 18, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toggleText: { fontSize: 13, color: "#222" },
  navbar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 64, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  navItem: { color: "#6BCB59", fontSize: 22 },
  navActive: { color: "#6BCB59", fontSize: 12, textAlign: "center" },
});