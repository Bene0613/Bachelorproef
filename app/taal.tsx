import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

export default function LanguageScreen() {
  const [language, setLanguage] = useState("Nederlands");

  const languages = [
    {
      label: "Nederlands",
      flag: require("../assets/images/nl.png"),
    },
    {
      label: "Français",
      flag: require("../assets/images/fr.png"),
    },
    {
      label: "English",
      flag: require("../assets/images/gb.png"),
    },
  ];

  return (
    <View style={styles.screen}>
      <PageHeader
        title="Instellingen"
        breadcrumbMain="Instellingen"
        breadcrumbActive="Taal"
      />

      <SectionHeader title="Taal" />

      {languages.map((item) => (
        <Pressable
          key={item.label}
          style={[
            styles.option,
            language === item.label && styles.optionActive,
          ]}
          onPress={() => setLanguage(item.label)}
        >
          <View style={styles.row}>
            <Image source={item.flag} style={styles.flag} />

            <Text style={styles.optionText}>
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}

      <BottomNav />
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
    paddingHorizontal: 26,
  },

  option: {
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 28,
  },

  optionActive: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    width: 20,
    height: 14,
    marginRight: 10,
    borderRadius: 2,
  },

  optionText: {
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