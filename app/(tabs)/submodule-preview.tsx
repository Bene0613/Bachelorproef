import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = "https://bachelorproef-4946.onrender.com";

export default function SubmodulePreviewScreen() {
  const router = useRouter();
  const { moduleId } = useLocalSearchParams();

  const cleanModuleId = Array.isArray(moduleId)
    ? moduleId[0]
    : moduleId;

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${API_URL}/modules/${cleanModuleId}/questions`
        );

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (cleanModuleId) fetchQuestions();
  }, [cleanModuleId]);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        style={styles.header}
      >
        <Text style={styles.title}>Oefeningen</Text>
      </LinearGradient>

      <View style={styles.greenLine} />

      <Text style={styles.description}>
        Start deze module en beantwoord de vragen één voor één. Je krijgt na
        elke vraag directe feedback.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Module klaar</Text>

        {loading ? (
          <ActivityIndicator color="#5CBC4F" />
        ) : (
          <>
            <Text style={styles.infoText}>
              Aantal vragen: {questions.length}
            </Text>

            <Text style={styles.infoText}>
              Feedback: na elke vraag
            </Text>

            <Text style={styles.infoText}>
              Resultaat: op het einde van de oefening
            </Text>

            <Pressable
              style={[
                styles.startButton,
                questions.length === 0 && styles.disabledButton,
              ]}
              disabled={questions.length === 0}
              onPress={() =>
                router.push({
                  pathname: "/practice-module",
                  params: { moduleId: cleanModuleId, restart: "true" },
                } as any)
              }
            >
              <Text style={styles.startButtonText}>
                Start oefeningen
              </Text>
              <Pressable
  style={styles.restartButton}
  disabled={questions.length === 0}
  onPress={() =>
    router.push({
      pathname: "/practice-module",
      params: {
        moduleId: cleanModuleId,
        restart: "true",
      },
    } as any)
  }
>
  <Text style={styles.restartButtonText}>
    Opnieuw maken
  </Text>
</Pressable>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  header: {
    paddingTop: 28,
    paddingBottom: 14,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#777",
  },

  greenLine: {
    height: 3,
    backgroundColor: "#6BCB59",
    width: "100%",
    marginBottom: 24,
  },

  description: {
    marginHorizontal: 34,
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    marginBottom: 24,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 34,
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
    marginBottom: 18,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },

  startButton: {
    marginTop: 22,
    backgroundColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },

  disabledButton: {
    opacity: 0.4,
  },

  startButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  restartButton: {
  marginTop: 12,
  borderWidth: 1.5,
  borderColor: "#5CBC4F",
  borderRadius: 8,
  paddingHorizontal: 22,
  paddingVertical: 11,
  backgroundColor: "#fff",
},

restartButtonText: {
  color: "#5CBC4F",
  fontSize: 13,
  fontWeight: "700",
},
});