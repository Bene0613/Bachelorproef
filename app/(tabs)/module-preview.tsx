import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";
import { supabase } from "../../lib/supabase";

const API_URL = "http://localhost:3000";

export default function ModulePreviewScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const subject = Array.isArray(params.subject)
    ? params.subject[0]
    : params.subject;

  const [subModules, setSubModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubModules();
  }, [subject]);

  const fetchSubModules = async () => {
    if (!subject) return;

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data: ownModules } = await supabase
        .from("modules")
        .select("*")
        .eq("created_by", user.id)
        .eq("subject", subject);

      const { data: classLinks } = await supabase
        .from("class_students")
        .select("class_id")
        .eq("student_id", user.id);

      const classIds = classLinks?.map((item) => item.class_id) || [];

      let teacherModules: any[] = [];

      if (classIds.length > 0) {
        const { data: moduleLinks } = await supabase
          .from("module_classes")
          .select("module_id")
          .in("class_id", classIds);

        const moduleIds = moduleLinks?.map((item) => item.module_id) || [];

        if (moduleIds.length > 0) {
          const res = await fetch(`${API_URL}/modules/by-ids`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids: moduleIds,
            }),
          });

          const fetchedTeacherModules = await res.json();

          teacherModules = (fetchedTeacherModules || []).filter(
            (module: any) =>
              module.subject?.trim().toLowerCase() ===
              subject.trim().toLowerCase()
          );
        }
      }

      setSubModules([...(teacherModules || []), ...(ownModules || [])]);
    } catch (err) {
      console.log("Fetch submodules error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <PageHeader title="Modules" />

      <SectionHeader title={subject || "Module"} />

      <Text style={styles.description}>
        Kies een subvak binnen {subject}.
      </Text>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Submodules</Text>

        <Image
          source={require("../../assets/images/exercise-preview.png")}
          style={styles.previewImage}
        />

        <View style={styles.statsRow}>
          <Text style={styles.stats}>
            Aantal submodules: {subModules.length}
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#5CBC4F" />
      ) : subModules.length === 0 ? (
        <Text style={styles.emptyText}>Geen submodules gevonden.</Text>
      ) : (
        subModules.map((item, index) => (
          <ModuleRow
            key={item.id}
            letter={item.sub_subject?.[0] || "?"}
            title={item.sub_subject || "Geen naam"}
            status="Onvoltooid"
            active={index === 0}
            onPress={() =>
              router.push({
                pathname: "/submodule-preview",
                params: { moduleId: item.id },
              } as any)
            }
          />
        ))
      )}
    </View>
  );
}

function ModuleRow({
  letter,
  title,
  status,
  active,
  onPress,
}: {
  letter: string;
  title: string;
  status: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <View style={[styles.moduleRow, active && styles.moduleRowActive]}>
      <View style={styles.subjectIcon}>
        <Text style={styles.subjectLetter}>{letter}</Text>
      </View>

      <View style={styles.moduleTextBox}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleStatus}>{status}</Text>
      </View>

      <Pressable style={styles.openButton} onPress={onPress}>
        <Text style={styles.openButtonText}>Open</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  description: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginBottom: 20,
    paddingHorizontal: 26,
  },

  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 26,
    marginBottom: 26,
    alignItems: "center",
  },

  previewTitle: {
    fontSize: 14,
    marginBottom: 8,
  },

  previewImage: {
    width: 150,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  stats: {
    fontSize: 11,
    color: "#222",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginTop: 20,
  },

  moduleRow: {
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginHorizontal: 26,
    marginBottom: 12,
  },

  moduleRowActive: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
  },

  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#6BCB59",
    alignItems: "center",
    justifyContent: "center",
  },

  subjectLetter: {
    color: "#fff",
    fontSize: 20,
  },

  moduleTextBox: {
    flex: 1,
    marginLeft: 16,
  },

  moduleTitle: {
    fontSize: 14,
    color: "#555",
  },

  moduleStatus: {
    fontSize: 10,
    color: "#999",
  },

  openButton: {
    backgroundColor: "#5CBC4F",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 7,
  },

  openButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});