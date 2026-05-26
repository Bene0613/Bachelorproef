import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";
import { supabase } from "../../lib/supabase";

type ModuleItem = {
  id: string;
  subject: string;
  sub_subject: string;
  created_at: string;
};

export default function StudentModulesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const studentId = Array.isArray(params.studentId)
    ? params.studentId[0]
    : params.studentId;

  const studentName = Array.isArray(params.studentName)
    ? params.studentName[0]
    : params.studentName;

  const subject = Array.isArray(params.subject)
    ? params.subject[0]
    : params.subject;

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudentModules();
  }, []);

  const fetchStudentModules = async () => {
    if (!studentId || !subject) return;

    const { data, error } = await supabase
      .from("modules")
      .select("id, subject, sub_subject, created_at")
      .eq("user_id", studentId)
      .eq("subject", subject)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Student modules error:", error);
      return;
    }

    setModules(data || []);
  };

  const filteredModules = modules.filter((item) =>
    item.sub_subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <PageHeader title="Modules" />

      <SectionHeader title={`${studentName || "Leerling"} · ${subject || ""}`} />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Zoeken"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <Text style={styles.searchIcon}>⌕</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{studentName}</Text>
        <Text style={styles.infoText}>
          Je ziet alleen modules voor het vak {subject}.
        </Text>
      </View>

      {filteredModules.length === 0 ? (
        <View style={styles.emptyContent}>
          <Image
            source={require("../../assets/images/empty-modules.png")}
            style={styles.emptyImage}
          />

          <Text style={styles.emptyTitle}>Geen modules gevonden</Text>

          <Text style={styles.emptyText}>
            Deze leerling heeft nog geen modules gemaakt voor {subject}.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.filterRow}>
            <Text style={styles.filterText}>Filters⌃</Text>

            <Pressable
              onPress={() => setLayout(layout === "grid" ? "list" : "grid")}
            >
              <Text style={styles.layoutButton}>
                {layout === "grid" ? "☷" : "▦"}
              </Text>
            </Pressable>
          </View>

          {layout === "grid" ? (
            <View style={styles.grid}>
              {filteredModules.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.gridCard}
                  onPress={() =>
                    router.push({
                      pathname: "/submodule-preview",
                      params: { moduleId: item.id },
                    } as any)
                  }
                >
                  <SubjectIcon letter={item.subject?.[0] || "?"} grid />

                  <Text style={styles.subjectName}>{item.subject}</Text>

                  <Text style={styles.subSubjectName}>
                    {item.sub_subject}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {filteredModules.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.listCard}
                  onPress={() =>
                    router.push({
                      pathname: "/submodule-preview",
                      params: { moduleId: item.id },
                    } as any)
                  }
                >
                  <SubjectIcon letter={item.subject?.[0] || "?"} />

                  <View>
                    <Text style={styles.listName}>{item.subject}</Text>

                    <Text style={styles.subSubjectName}>
                      {item.sub_subject}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function SubjectIcon({
  letter,
  grid,
}: {
  letter: string;
  grid?: boolean;
}) {
  return (
    <View style={[styles.subjectIcon, grid && styles.subjectIconGrid]}>
      <Text style={styles.subjectLetter}>{letter.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  searchBox: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginHorizontal: 26,
    marginBottom: 16,
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

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 26,
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 11,
    color: "#777",
  },

  emptyContent: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 26,
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
    width: 250,
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 26,
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
    paddingHorizontal: 26,
  },

  gridCard: {
    width: "46%",
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  list: {
    gap: 18,
    paddingHorizontal: 26,
  },

  listCard: {
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
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

  subSubjectName: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
});