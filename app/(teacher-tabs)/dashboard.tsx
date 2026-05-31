import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

type ModuleCard = {
  id: string;
  subject: string;
  subSubject: string;
  classNames: string[];
  average: number;
};

type ClassAverage = {
  classId: string;
  className: string;
  average: number;
};

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [moduleCards, setModuleCards] = useState<ModuleCard[]>([]);
  const [classAverages, setClassAverages] = useState<ClassAverage[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewStudents, setPreviewStudents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: teacherModules } = await supabase
        .from("modules")
        .select("id, subject, sub_subject")
        .eq("created_by", user.id)
        .eq("owner_role", "leerkracht");

      const moduleIds = teacherModules?.map((m) => m.id) || [];

      if (moduleIds.length === 0) {
        setModuleCards([]);
        setClassAverages([]);
        setStudentCount(0);
        setLoading(false);
        return;
      }

      const { data: moduleClasses } = await supabase
        .from("module_classes")
        .select("module_id, class_id")
        .in("module_id", moduleIds);

      const classIds = [
        ...new Set((moduleClasses || []).map((item) => item.class_id)),
      ];

      const { data: classes } = await supabase
        .from("classes")
        .select("id, name")
        .in("id", classIds);

      const { data: classStudents } = await supabase
        .from("class_students")
        .select("class_id, student_id")
        .in("class_id", classIds);

      const allStudentIds = [
        ...new Set((classStudents || []).map((item) => item.student_id)),

      ];

      const { data: studentProfiles } = await supabase
  .from("profiles")
  .select("id, avatar_url")
  .in("id", allStudentIds);

    setPreviewStudents(studentProfiles || []);

      const { data: progressRows } = await supabase
        .from("module_progress")
        .select("module_id, student_id, progress_percent")
        .in("module_id", moduleIds)
        .in("student_id", allStudentIds);

      setStudentCount(allStudentIds.length);

      const moduleResults: ModuleCard[] = (teacherModules || []).map(
        (module) => {
          const links =
            moduleClasses?.filter((item) => item.module_id === module.id) ||
            [];

          const linkedClassIds = links.map((item) => item.class_id);

          const linkedClasses =
            classes?.filter((item) => linkedClassIds.includes(item.id)) || [];

          const linkedStudentIds =
            classStudents
              ?.filter((item) => linkedClassIds.includes(item.class_id))
              .map((item) => item.student_id) || [];

          const progressForModule =
            progressRows?.filter(
              (row) =>
                row.module_id === module.id &&
                linkedStudentIds.includes(row.student_id)
            ) || [];

          const average =
            progressForModule.length > 0
              ? Math.round(
                  progressForModule.reduce(
                    (sum, row) => sum + (row.progress_percent || 0),
                    0
                  ) / progressForModule.length
                )
              : 0;

          return {
            id: module.id,
            subject: module.subject,
            subSubject: module.sub_subject,
            classNames: linkedClasses.map((item) => item.name),
            average,
          };
        }
      );

      const currentModule =
        moduleResults[selectedIndex] || moduleResults[0];

      const selectedModuleLinks =
        moduleClasses?.filter((item) => item.module_id === currentModule?.id) ||
        [];

      const selectedClassIds = selectedModuleLinks.map(
        (item) => item.class_id
      );

      const selectedClassAverages: ClassAverage[] =
        (classes || [])
          .filter((classItem) => selectedClassIds.includes(classItem.id))
          .map((classItem) => {
            const studentsInClass =
              classStudents?.filter(
                (item) => item.class_id === classItem.id
              ) || [];

            const studentIdsInClass = studentsInClass.map(
              (item) => item.student_id
            );

            const progressForClass =
              progressRows?.filter(
                (row) =>
                  row.module_id === currentModule?.id &&
                  studentIdsInClass.includes(row.student_id)
              ) || [];

            const average =
              progressForClass.length > 0
                ? Math.round(
                    progressForClass.reduce(
                      (sum, row) => sum + (row.progress_percent || 0),
                      0
                    ) / progressForClass.length
                  )
                : 0;

            return {
              classId: classItem.id,
              className: classItem.name,
              average,
            };
          });

      setModuleCards(moduleResults);
      setClassAverages(selectedClassAverages);
    } catch (error) {
      console.log("Teacher dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedModule = moduleCards[selectedIndex];

  const goPrevious = () => {
    if (moduleCards.length === 0) return;

    const nextIndex =
      selectedIndex === 0 ? moduleCards.length - 1 : selectedIndex - 1;

    setSelectedIndex(nextIndex);
  };

  const goNext = () => {
    if (moduleCards.length === 0) return;

    const nextIndex =
      selectedIndex === moduleCards.length - 1 ? 0 : selectedIndex + 1;

    setSelectedIndex(nextIndex);
  };

  return (
    <ScrollView style={styles.screen}>
      <PageHeader title="Dashboard" />

      <Text style={styles.description}>
        Bekijk de resultaten van jouw studenten bij elke oefenmodule die je
        gemaakt hebt.
      </Text>

      {loading ? (
        <ActivityIndicator color="#5CBC4F" style={styles.loader} />
      ) : moduleCards.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Nog geen resultaten beschikbaar.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.chartWrapper}>
            <Pressable style={styles.sideArrow} onPress={goPrevious}>
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>
                {selectedModule?.subject}
              </Text>

              <View style={styles.chartArea}>
                <View style={styles.axisLabels}>
                  <Text style={styles.axisText}>100</Text>
                  <Text style={styles.axisText}>75</Text>
                  <Text style={styles.axisText}>50</Text>
                  <Text style={styles.axisText}>25</Text>
                  <Text style={styles.axisText}>0</Text>
                </View>

                <View style={styles.barsArea}>
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />

                  <View style={styles.barsRow}>
                    {classAverages.map((item, index) => (
                      <View key={item.classId} style={styles.barGroup}>
                        <View
                          style={[
                            styles.bar,
                            index % 2 === 0
                              ? styles.blueBar
                              : styles.greenBar,
                            {
                              height: `${Math.max(item.average, 6)}%`,
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.legendRow}>
                {classAverages.map((item, index) => (
                  <View key={item.classId} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        index % 2 === 0
                          ? styles.blueDot
                          : styles.greenDot,
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {item.className}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.averageLegend}>
  {classAverages.map((item) => (
    <Text key={item.classId} style={styles.averageLegendText}>
      {item.className}: {item.average}%
    </Text>
  ))}
</View>
            </View>

            <Pressable style={styles.sideArrow} onPress={goNext}>
              <Text style={styles.arrowText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.greenSummary}>
  <Text style={styles.summaryText}>
    {studentCount} leerlingen
  </Text>

  <View style={styles.avatarRow}>
    {previewStudents.slice(0, 5).map((student) => (
      <Image
        key={student.id}
        source={
          student.avatar_url
            ? { uri: student.avatar_url }
            : require("../../assets/images/user.jpg")
        }
        style={styles.smallAvatar}
      />
    ))}

    <View style={styles.plusCircle}>
      <Text style={styles.plusText}>+</Text>
    </View>
  </View>
</View>

          {moduleCards.map((module) => (
            <View key={module.id} style={styles.moduleCard}>
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>
                  {module.subject?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>

              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>
                  {module.subject}
                </Text>

                <Text style={styles.moduleClasses}>
                  {module.classNames.join(", ") || "Geen klas"}
                </Text>

                <Text style={styles.moduleAverage}>
                  Gemiddelde score: {module.average}%
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  description: {
    marginHorizontal: 54,
    marginTop: 22,
    marginBottom: 22,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    textAlign: "center",
  },

  loader: {
    marginTop: 40,
  },

  emptyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 36,
    borderRadius: 14,
    padding: 24,
    marginTop: 30,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
  },

  chartWrapper: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 24,
},

  sideArrow: {
    width: 12,
    alignItems: "center",
  },

  arrowText: {
    fontSize: 28,
    color: "#999",
  },

  chartCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 14,
  },

  chartTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
    marginBottom: 14,
  },

  chartArea: {
    flexDirection: "row",
    height: 260,
  },

  axisLabels: {
    width: 32,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
  },

  axisText: {
    fontSize: 12,
    color: "#555",
  },

  barsArea: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#eee",
  },

  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: "100%",
    gap: 12,
  },

  barGroup: {
    width: 40,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 25,
    borderRadius: 6,
  },

  blueBar: {
    backgroundColor: "#6C7DF2",
  },

  greenBar: {
    backgroundColor: "#AEBEAD",
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 5,
  },

  blueDot: {
    backgroundColor: "#6C7DF2",
  },

  greenDot: {
    backgroundColor: "#AEBEAD",
  },

  legendText: {
    fontSize: 11,
    color: "#555",
  },

greenSummary: {
  marginTop: 28,
  marginBottom: 28,
  alignSelf: "center",
  backgroundColor: "#A9CFA4",
  borderRadius: 16,
  paddingVertical: 9,
  paddingHorizontal: 14,
  flexDirection: "row",
  alignItems: "center",
},

summaryText: {
  color: "#fff",
  fontSize: 12,
  marginRight: 12,
},

avatarRow: {
  flexDirection: "row",
  alignItems: "center",
},


smallAvatar: {
  width: 22,
  height: 22,
  borderRadius: 6,
  marginLeft: 4,
  borderWidth: 1,
  borderColor: "#fff",
},

plusCircle: {
  width: 22,
  height: 22,
  borderRadius: 6,
  backgroundColor: "#333",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 4,
},

plusText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},

averageLegend: {
  marginTop: 12,
  alignItems: "center",
},

averageLegendText: {
  fontSize: 11,
  color: "#555",
  marginTop: 3,
},

  moduleCard: {
    marginHorizontal: 40,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#D9D948",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  iconText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  moduleInfo: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: 16,
    color: "#444",
  },

  moduleClasses: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  moduleAverage: {
    fontSize: 11,
    color: "#5CBC4F",
    marginTop: 4,
    fontWeight: "700",
  },
});