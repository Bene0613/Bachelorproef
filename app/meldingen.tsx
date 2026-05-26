import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Meldingen"
      />

      <SectionHeader title="Meldingen" />

      <View style={styles.content}>
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
      </View>

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
        trackColor={{
          false: "#8A8A8A",
          true: "#5CBC4F",
        }}
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

  toggleRow: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  toggleText: {
    fontSize: 13,
    color: "#222",
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