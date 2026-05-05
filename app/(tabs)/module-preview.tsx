import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function ModulePreviewScreen() {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
  <Text style={styles.title}>Modules</Text>
</LinearGradient>

<View style={styles.greenLine} />

      <Text style={styles.description}>
        Bekijk de preview van de gemaakt oefeningen in elke module.
      </Text>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Preview</Text>

        <Image
          source={require("../../assets/images/exercise-preview.png")}
          style={styles.previewImage}
        />

        <View style={styles.statsRow}>
          <Text style={styles.stats}>Aantal vragen: 2</Text>
          <Text style={styles.stats}>Voltooide vragen: 0</Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.stats}>Gemaakt op: 10/2/26</Text>
          <Text style={styles.stats}>Gedeeld: 0</Text>
        </View>
      </View>

      <ModuleRow letter="W" title="Meetkunde" status="Onvoltooid" active />
      <ModuleRow letter="F" title="Statistieken" status="Voltooid" />
      <ModuleRow letter="C" title="Algebra" status="Voltooid" />
    </View>
  );
}

function ModuleRow({
  letter,
  title,
  status,
  active,
}: {
  letter: string;
  title: string;
  status: string;
  active?: boolean;
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

      <Pressable style={styles.openButton}>
        <Text style={styles.openButtonText}>Open</Text>
      </Pressable>
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
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#777",
    marginBottom: 12,
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
    marginBottom: 22,
  },
  description: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginBottom: 28,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
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
  moduleRow: {
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
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
    fontSize: 26,
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