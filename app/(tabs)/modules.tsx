import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const subjects = [
  { letter: "W", name: "Wiskunde" },
  { letter: "F", name: "Fysica" },
  { letter: "C", name: "Chemie" },
  { letter: "I", name: "Informatica" },
  { letter: "E", name: "Electrica" },
  { letter: "T", name: "Techniek" },
];

export default function ModulesScreen() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [hasModules, setHasModules] = useState(false);

  const openSubject = (name: string) => {
    if (name === "Wiskunde") {
      router.push("/module-preview" as any);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={["#EAF6E5", "#FFF9FC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.header}
    >
  <Text style={styles.title}>Modules</Text>
</LinearGradient>

<View style={styles.greenLine} />

      <LinearGradient
  colors={["#EAF6E5", "#FFF9FC"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.searchArea}
>
  <View style={styles.searchBox}>
    <TextInput placeholder="Text input" style={styles.input} />
    <Text style={styles.searchIcon}>⌕</Text>
  </View>
</LinearGradient>

      {!hasModules ? (
        <View style={styles.emptyContent}>
          <Image
            source={require("../../assets/images/empty-modules.png")}
            style={styles.emptyImage}
          />

          <Text style={styles.emptyTitle}>Er zijn nog geen modules</Text>

          <Text style={styles.emptyText}>
            Ga naar Home om een PDF te uploaden en je eerste module te maken
          </Text>

          <Pressable onPress={() => setHasModules(true)}>
            <Text style={styles.refresh}>↻</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.filterRow}>
            <Text style={styles.filterText}>Filters⌃</Text>

            <Pressable onPress={() => setLayout(layout === "grid" ? "list" : "grid")}>
              <Text style={styles.layoutButton}>{layout === "grid" ? "☷" : "▦"}</Text>
            </Pressable>
          </View>

          {layout === "grid" ? (
            <View style={styles.grid}>
              {subjects.map((item) => (
                <Pressable
                  key={item.name}
                  style={styles.gridCard}
                  onPress={() => openSubject(item.name)}
                >
                  <SubjectIcon letter={item.letter} grid />
                  <Text style={styles.subjectName}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {subjects.slice(0, 5).map((item) => (
                <Pressable
                  key={item.name}
                  style={[
                    styles.listCard,
                    item.name === "Wiskunde" && styles.activeListCard,
                  ]}
                  onPress={() => openSubject(item.name)}
                >
                  <SubjectIcon letter={item.letter} />
                  <Text style={styles.listName}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function SubjectIcon({ letter, grid }: { letter: string; grid?: boolean }) {
  return (
    <View style={[styles.subjectIcon, grid && styles.subjectIconGrid]}>
      <Text style={styles.subjectLetter}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
    paddingTop: 28,
    paddingHorizontal: 26,
  },
  header: {
  height: 100,
  justifyContent: "flex-end",
  alignItems: "center",
  paddingBottom: 12,
},
greenLine: {
  height: 3,
  backgroundColor: "#6BCB59",
  marginHorizontal: -26,
  marginBottom: 0,
},
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#777",
    marginBottom: 0,
  },
searchArea: {
  marginHorizontal: -26,
  paddingHorizontal: 26,
  paddingVertical: 20,
  marginTop: 0,
  marginBottom: 8,
},
  searchBox: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 28,
  },
  input: {
    fontSize: 13,
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: 10,
    fontSize: 20,
    color: "#777",
  },

  emptyContent: {
    alignItems: "center",
    marginTop: 42,
  },
  emptyImage: {
    width: 190,
    height: 160,
    resizeMode: "contain",
    marginBottom: 28,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  emptyText: {
    width: 230,
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
  refresh: {
    fontSize: 22,
    marginTop: 18,
    color: "#333",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 13,
  },
  layoutButton: {
    fontSize: 18,
    color: "#777",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "46%",
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  list: {
    gap: 18,
  },
  listCard: {
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  activeListCard: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
  },
  subjectIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#6BCB59",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  subjectIconGrid: {
    marginRight: 0,
  },
  subjectLetter: {
    color: "#fff",
    fontSize: 28,
  },
  subjectName: {
    marginTop: 10,
    fontSize: 15,
    color: "#444",
  },
  listName: {
    fontSize: 16,
    color: "#555",
  },
});