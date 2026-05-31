import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ConfirmModal from "../../components/ConfirmModal";
import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";
import { supabase } from "../../lib/supabase";

const API_URL = "http://localhost:3000";

export default function ModulesScreen() {
  const router = useRouter();

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [modules, setModules] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchModules();
    }, [])
  );

  const fetchModules = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data: ownModules, error: ownError } = await supabase
        .from("modules")
        .select("*")
        .eq("created_by", user.id);

      if (ownError) {
        console.log("Own modules error:", ownError);
      }

      const { data: classLink } = await supabase
        .from("class_students")
        .select("class_id")
        .eq("student_id", user.id);

      const classIds = classLink?.map((item) => item.class_id) || [];

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
          teacherModules = fetchedTeacherModules || [];
        }
      }

      const ownModulesWithSource = (ownModules || []).map((module) => ({
        ...module,
        source: "student",
      }));

      const teacherModulesWithSource = teacherModules.map((module) => ({
        ...module,
        source: "teacher",
      }));

      setModules([...teacherModulesWithSource, ...ownModulesWithSource]);
    } catch (err) {
      console.log(err);
    }
  };

  const askDeleteModule = (moduleId: string) => {
    setModuleToDelete(moduleId);
    setDeleteModalVisible(true);
  };

  const deleteModule = async (moduleId: string) => {
    try {
      const res = await fetch(`${API_URL}/modules/${moduleId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Module verwijderen mislukt");
      }

      setModules((prev) => prev.filter((item) => item.id !== moduleId));
    } catch (error) {
      console.log("Delete module error:", error);
      alert(String(error));
    }
  };

  const hasModules = modules.length > 0;

  const teacherModules = modules.filter((item) => item.source === "teacher");
  const studentModules = modules.filter((item) => item.source === "student");

  return (
    <View style={styles.screen}>
      <PageHeader title="Modules" />

      <SectionHeader title="Mijn modules" />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Zoeken"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <Text style={styles.searchIcon}>⌕</Text>
      </View>

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

          <ModuleSection
            title="Modules van je leerkrachten"
            modules={teacherModules}
            layout={layout}
            router={router}
            askDeleteModule={askDeleteModule}
          />

          <ModuleSection
            title="Jouw modules"
            modules={studentModules}
            layout={layout}
            router={router}
            askDeleteModule={askDeleteModule}
          />
        </>
      )}

      <ConfirmModal
        visible={deleteModalVisible}
        title="Module verwijderen?"
        message="Ben je zeker dat je deze module wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden."
        cancelText="Annuleren"
        confirmText="Verwijderen"
        destructive
        onCancel={() => {
          setDeleteModalVisible(false);
          setModuleToDelete(null);
        }}
        onConfirm={() => {
          if (moduleToDelete) {
            deleteModule(moduleToDelete);
          }

          setDeleteModalVisible(false);
          setModuleToDelete(null);
        }}
      />
    </View>
  );
}

function ModuleSection({
  title,
  modules,
  layout,
  router,
  askDeleteModule,
}: {
  title: string;
  modules: any[];
  layout: "grid" | "list";
  router: any;
  askDeleteModule: (id: string) => void;
}) {
  if (modules.length === 0) return null;

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {layout === "grid" ? (
        <View style={styles.grid}>
          {modules.map((item) => (
            <View
              key={item.id}
              style={[
                styles.gridCard,
                item.source === "teacher" && styles.teacherCard,
              ]}
            >
              {item.source === "teacher" && (
                <View style={styles.teacherBadge}>
                  <Text style={styles.teacherBadgeText}>LEERKRACHT</Text>
                </View>
              )}

              {item.source === "student" && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => askDeleteModule(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.gridCardContent}
                onPress={() =>
                  router.push({
                    pathname: "/module-preview",
                    params: {
                      subject: item.subject,
                    },
                  } as any)
                }
              >
                <SubjectIcon letter={item.subject?.[0] || "?"} grid />

                <Text style={styles.subjectName}>{item.subject}</Text>

                <Text style={styles.subSubjectName}>{item.sub_subject}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          {modules.map((item) => (
            <View
              key={item.id}
              style={[
                styles.listCard,
                item.source === "teacher" && styles.teacherCard,
              ]}
            >
              <Pressable
                style={styles.listContent}
                onPress={() =>
                  router.push({
                    pathname: "/module-preview",
                    params: {
                      subject: item.subject,
                    },
                  } as any)
                }
              >
                <SubjectIcon letter={item.subject?.[0] || "?"} />

                <View>
                  <Text style={styles.listName}>{item.subject}</Text>

                  <Text style={styles.subSubjectName}>
                    {item.sub_subject}
                  </Text>

                  {item.source === "teacher" && (
                    <Text style={styles.teacherSmallText}>
                      Module van leerkracht
                    </Text>
                  )}
                </View>
              </Pressable>

              {item.source === "student" && (
                <Pressable
                  style={styles.listDeleteButton}
                  onPress={() => askDeleteModule(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
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
    marginBottom: 22,
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
    width: 230,
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

  sectionBlock: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    marginHorizontal: 26,
    marginBottom: 12,
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
    marginBottom: 24,
    position: "relative",
  },

  gridCardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "space-between",
  },

  listContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },

  listDeleteButton: {
    padding: 8,
  },

  deleteButtonText: {
    fontSize: 14,
    color: "#E56D6D",
  },

  teacherCard: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
  },

  teacherBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EAF6E5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 10,
  },

  teacherBadgeText: {
    fontSize: 8,
    color: "#5CBC4F",
    fontWeight: "700",
  },

  teacherSmallText: {
    fontSize: 10,
    color: "#5CBC4F",
    marginTop: 2,
  },
});