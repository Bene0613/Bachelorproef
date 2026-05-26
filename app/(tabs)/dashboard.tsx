import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

type Module = {
  id: string;
  subject: string;
  sub_subject: string;
  progress_percent: number;
};

export default function DashboardScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("modules")
      .select("id, subject, sub_subject, progress_percent")
      .eq("user_id", user.id);

    if (error) {
      console.log("Dashboard error:", error);
      return;
    }

    const fetchedModules = data || [];

    setModules(fetchedModules);

    const uniqueSubjects = [
      ...new Set(fetchedModules.map((m) => m.subject)),
    ];

    if (uniqueSubjects.length > 0) {
      setSelectedSubject(uniqueSubjects[0]);
    }
  };

  const subjects = [...new Set(modules.map((m) => m.subject))];

  const selectedModules = modules.filter(
    (m) => m.subject === selectedSubject
  );

  return (
    <View style={styles.screen}>
      <PageHeader title="Dashboard" />

      <View style={styles.topCard}>
        <Text style={styles.topTitle}>
          {selectedSubject || "Geen vak"}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.chartBox}>
            {selectedModules.slice(0, 4).map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.chartPill,
                  index === 0 && styles.chartPillOne,
                  index === 1 && styles.chartPillTwo,
                  index === 2 && styles.chartPillThree,
                  index === 3 && styles.chartPillFour,
                ]}
              >
                <Text style={styles.chartPercent}>
                  {item.progress_percent}%
                </Text>
              </View>
            ))}

            <View style={styles.chartCenter} />
          </View>

          <View style={styles.legend}>
            {selectedModules.map((item, index) => (
              <View key={item.id} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    index === 0 && styles.dotOne,
                    index === 1 && styles.dotTwo,
                    index === 2 && styles.dotThree,
                    index === 3 && styles.dotFour,
                  ]}
                />

                <Text style={styles.legendText}>
                  {item.sub_subject}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.moduleList}>
        {subjects.map((subject) => (
          <Pressable
            key={subject}
            style={[
              styles.moduleCard,
              selectedSubject === subject && styles.activeModuleCard,
            ]}
            onPress={() => setSelectedSubject(subject)}
          >
            <View style={styles.moduleIcon}>
              <Text style={styles.moduleIconText}>{subject[0]}</Text>
            </View>

            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{subject}</Text>

              <View style={styles.breadcrumbRow}>
                <Text style={styles.breadcrumb}>Modules</Text>
                <Text style={styles.breadcrumbSlash}>/</Text>
                <Text style={styles.breadcrumbCurrent}>{subject}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  topCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 46,
    marginTop: 56,
    marginBottom: 30,
    paddingVertical: 28,
    paddingHorizontal: 22,
  },

  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 22,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chartBox: {
    width: 140,
    height: 140,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  chartCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    position: "absolute",
  },

  chartPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  chartPillOne: {
    top: 0,
    left: 42,
    backgroundColor: "#FFF3C9",
  },

  chartPillTwo: {
    right: 4,
    top: 42,
    backgroundColor: "#F8DCDC",
  },

  chartPillThree: {
    bottom: 0,
    left: 42,
    backgroundColor: "#DFF3DE",
  },

  chartPillFour: {
    left: 4,
    top: 42,
    backgroundColor: "#E2E7FF",
  },

  chartPercent: {
    fontSize: 9,
    color: "#777",
    fontWeight: "600",
  },

  legend: {
    marginLeft: 28,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },

  dotOne: {
    backgroundColor: "#FFF3C9",
  },

  dotTwo: {
    backgroundColor: "#F8DCDC",
  },

  dotThree: {
    backgroundColor: "#DFF3DE",
  },

  dotFour: {
    backgroundColor: "#E2E7FF",
  },

  legendText: {
    color: "#555",
    fontSize: 12,
  },

  moduleList: {
    paddingHorizontal: 46,
  },

  moduleCard: {
    height: 74,
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  activeModuleCard: {
    borderWidth: 1.5,
    borderColor: "#8ED27A",
  },

  moduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#8ED27A",
    justifyContent: "center",
    alignItems: "center",
  },

  moduleIconText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  moduleInfo: {
    marginLeft: 18,
  },

  moduleTitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 3,
  },

  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  breadcrumb: {
    fontSize: 10,
    color: "#777",
    textDecorationLine: "underline",
  },

  breadcrumbSlash: {
    marginHorizontal: 5,
    fontSize: 10,
    color: "#999",
  },

  breadcrumbCurrent: {
    fontSize: 10,
    color: "#777",
    textDecorationLine: "underline",
  },
});