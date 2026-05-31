import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

const API_URL = "https://bachelorproef-4946.onrender.com";

type AnswerResult = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  isCorrect: boolean;
};

export default function PracticeModuleScreen() {
  const router = useRouter();
  const { moduleId } = useLocalSearchParams();

  const cleanModuleId = Array.isArray(moduleId)
    ? moduleId[0]
    : moduleId;

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `${API_URL}/modules/${cleanModuleId}/questions`
      );

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const currentQuestion = questions[currentIndex];

  const normalize = (text: string) =>
    text.trim().toLowerCase();

  const isCorrect =
    normalize(selectedAnswer) ===
    normalize(currentQuestion?.correct_answer || "");

  const handleCheck = () => {
    if (!selectedAnswer.trim()) {
      alert("Geef eerst een antwoord.");
      return;
    }

    const result: AnswerResult = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correct_answer,
      userAnswer: selectedAnswer,
      explanation:
        currentQuestion.explanation ||
        "Er is nog geen extra uitleg beschikbaar voor deze vraag.",
      isCorrect,
    };

    setAnswerResults((prev) => [...prev, result]);
    setFeedbackShown(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setFeedbackShown(false);
    } else {
      setFinished(true);
      await saveProgress();
    }
  };

  const saveProgress = async () => {
    if (!cleanModuleId || questions.length === 0) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const correctCount = answerResults.filter(
      (item) => item.isCorrect
    ).length;

    const percent = Math.round(
      (correctCount / questions.length) * 100
    );

    await supabase.from("module_progress").upsert({
      module_id: cleanModuleId,
      student_id: user.id,
      progress_percent: percent,
      updated_at: new Date().toISOString(),
    });
  };

  const restartExercise = () => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFeedbackShown(false);
    setAnswerResults([]);
    setFinished(false);
  };

  if (!currentQuestion && !finished) {
    return (
      <View style={styles.screen}>
        <PageHeader title="Oefeningen" />
        <Text style={styles.emptyText}>Geen vragen gevonden.</Text>
      </View>
    );
  }

  if (finished) {
    const correctCount = answerResults.filter(
      (item) => item.isCorrect
    ).length;

    const percent = Math.round(
      (correctCount / questions.length) * 100
    );

    const wrongAnswers = answerResults.filter(
      (item) => !item.isCorrect
    );

    return (
      <ScrollView style={styles.screen}>
        <PageHeader title="Modules" />

        <Text style={styles.resultIntro}>
          Hier kan je jouw resultaten zien.
        </Text>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Resultaat</Text>

          <View style={styles.resultContent}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{percent}%</Text>
            </View>

            <View style={styles.resultTextBox}>
              <Text style={styles.resultLabel}>
                {percent >= 80
                  ? "Uitstekend"
                  : percent >= 60
                  ? "Goed gedaan"
                  : "Nog wat oefenen"}
              </Text>

              <Text style={styles.resultDescription}>
                Je had {correctCount} van de {questions.length} vragen juist.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Detail feedback</Text>

          {wrongAnswers.length === 0 ? (
            <Text style={styles.detailText}>
              Je had alles juist. Je beheerst deze module goed.
            </Text>
          ) : (
            <>
              <Text style={styles.detailText}>
                Je hebt nog wat moeite met deze vragen:
              </Text>

              {wrongAnswers.map((item, index) => (
                <View key={index} style={styles.wrongItem}>
                  <Text style={styles.wrongQuestion}>
                    Vraag {index + 1}: {item.question}
                  </Text>

                  <Text style={styles.wrongAnswer}>
                    Jouw antwoord: {item.userAnswer}
                  </Text>

                  <Text style={styles.correctAnswer}>
                    Correct antwoord: {item.correctAnswer}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        <Pressable style={styles.retryButton} onPress={restartExercise}>
          <Text style={styles.retryButtonText}>Opnieuw maken</Text>
        </Pressable>

        <Pressable
          style={styles.modulesButton}
          onPress={() => router.replace("/modules" as any)}
        >
          <Text style={styles.modulesButtonText}>Terug naar modules</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <PageHeader title="Oefenen" />

      <View style={styles.card}>
        <Text style={styles.counter}>
          Vraag {currentIndex + 1} / {questions.length}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentIndex + 1) / questions.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        <Text style={styles.question}>{currentQuestion.question}</Text>

        {currentQuestion.answers?.length > 0 ? (
          currentQuestion.answers.map((answer: string) => (
            <Pressable
              key={answer}
              disabled={feedbackShown}
              style={[
                styles.answerBox,
                selectedAnswer === answer && styles.answerSelected,
              ]}
              onPress={() => setSelectedAnswer(answer)}
            >
              <Text style={styles.answerText}>{answer}</Text>
            </Pressable>
          ))
        ) : (
          <TextInput
            editable={!feedbackShown}
            style={styles.input}
            placeholder="Typ je antwoord"
            placeholderTextColor="#999"
            value={selectedAnswer}
            onChangeText={setSelectedAnswer}
            multiline
          />
        )}

        {!feedbackShown ? (
          <Pressable style={styles.button} onPress={handleCheck}>
            <Text style={styles.buttonText}>Doorgaan</Text>
          </Pressable>
        ) : (
          <View
            style={[
              styles.feedbackBox,
              isCorrect ? styles.correctBox : styles.wrongBox,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {isCorrect ? "Juist" : "Niet juist"}
            </Text>

            <Text style={styles.feedbackText}>
              Correct antwoord: {currentQuestion.correct_answer}
            </Text>

            <Text style={styles.feedbackExplanation}>
              {currentQuestion.explanation ||
                "Er is nog geen extra uitleg beschikbaar voor deze vraag."}
            </Text>

            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {currentIndex < questions.length - 1
                  ? "Volgende vraag"
                  : "Bekijk resultaat"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 28,
    marginTop: 34,
    borderRadius: 16,
    padding: 22,
  },

  counter: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },

  progressTrack: {
    height: 5,
    backgroundColor: "#E6E6E6",
    borderRadius: 4,
    marginBottom: 18,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#5CBC4F",
    borderRadius: 4,
  },

  question: {
    fontSize: 18,
    color: "#444",
    fontWeight: "700",
    marginBottom: 22,
    lineHeight: 25,
  },

  answerBox: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E2DDE0",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  answerSelected: {
    borderColor: "#5CBC4F",
    backgroundColor: "#EAF6E5",
  },

  answerText: {
    fontSize: 14,
    color: "#555",
  },

  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E2DDE0",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 18,
  },

  button: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 12,
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  feedbackBox: {
    borderRadius: 10,
    padding: 16,
    marginTop: 18,
  },

  correctBox: {
    backgroundColor: "#EAF6E5",
  },

  wrongBox: {
    backgroundColor: "#FDECEC",
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },

  feedbackText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    textAlign: "center",
  },

  feedbackExplanation: {
    marginTop: 12,
    fontSize: 13,
    color: "#444",
    lineHeight: 20,
    textAlign: "center",
  },

  resultIntro: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginTop: 24,
    marginBottom: 24,
  },

  resultCard: {
    backgroundColor: "#fff",
    marginHorizontal: 38,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: "#8ED27A",
    marginBottom: 34,
  },

  resultTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
  },

  resultContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 12,
    borderColor: "#D95B5B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 28,
  },

  circleText: {
    fontSize: 16,
    color: "#333",
  },

  resultTextBox: {
    flex: 1,
  },

  resultLabel: {
    fontSize: 15,
    color: "#444",
    fontWeight: "700",
    marginBottom: 8,
  },

  resultDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },

  detailCard: {
    backgroundColor: "#fff",
    marginHorizontal: 38,
    borderRadius: 10,
    padding: 24,
    minHeight: 190,
    marginBottom: 18,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
    textAlign: "center",
    marginBottom: 22,
  },

  detailText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    marginBottom: 14,
  },

  wrongItem: {
    marginBottom: 14,
  },

  wrongQuestion: {
    fontSize: 13,
    color: "#444",
    fontWeight: "700",
    marginBottom: 4,
  },

  wrongAnswer: {
    fontSize: 12,
    color: "#D95B5B",
    marginBottom: 2,
  },

  correctAnswer: {
    fontSize: 12,
    color: "#5CBC4F",
  },

  retryButton: {
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  retryButtonText: {
    color: "#5CBC4F",
    fontSize: 13,
    fontWeight: "700",
  },

  modulesButton: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginBottom: 40,
  },

  modulesButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});