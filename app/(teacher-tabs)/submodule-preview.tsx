import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
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
  const { moduleId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${API_URL}/modules/${moduleId}/questions`
        );
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuestions();
  }, [moduleId]);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        style={styles.header}
      >
        <Text style={styles.title}>Vragen</Text>
      </LinearGradient>

      <View style={styles.greenLine} />

      <Text style={styles.description}>
        Bekijk en open de vragen van dit subvak.
      </Text>

      {loading ? (
        <ActivityIndicator color="#5CBC4F" />
      ) : questions.length === 0 ? (
        <Text style={styles.emptyText}>
          Geen vragen gevonden.
        </Text>
      ) : (
        questions.map((q, index) => (
          <QuestionRow
            key={q.id}
            index={index + 1}
            question={q.question}
            answers={q.answers}
            correct={q.correct_answer}
          />
        ))
      )}
    </View>
  );
}

function QuestionRow({
  index,
  question,
  answers,
  correct,
}: {
  index: number;
  question: string;
  answers: string[];
  correct: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.number}>{index}.</Text>
        <Text style={styles.question}>{question}</Text>
        <Pressable onPress={() => setOpen(!open)}>
          <Text style={styles.openBtn}>{open ? "Sluit" : "Open"}</Text>
        </Pressable>
      </View>

      {open && (
        <View style={styles.answersBox}>
          {answers.map((a) => (
            <Text
              key={a}
              style={[
                styles.answer,
                a === correct && styles.correct,
              ]}
            >
              • {a}
            </Text>
          ))}
        </View>
      )}
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#777",
  },
  greenLine: {
    height: 3,
    backgroundColor: "#6BCB59",
    marginHorizontal: -26,
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontWeight: "700",
    marginRight: 6,
  },
  question: {
    flex: 1,
    fontSize: 13,
    color: "#444",
  },
  openBtn: {
    color: "#5CBC4F",
    fontWeight: "600",
  },
  answersBox: {
    marginTop: 10,
  },
  answer: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  correct: {
    color: "#5CBC4F",
    fontWeight: "700",
  },
});