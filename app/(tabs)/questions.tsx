import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ConfirmModal from "../../components/ConfirmModal";

const API_URL = "https://bachelorproef-4946.onrender.com";

export default function QuestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const moduleId = Array.isArray(params.moduleId)
    ? params.moduleId[0]
    : params.moduleId;

  const questionsParam = Array.isArray(params.questions)
    ? params.questions[0]
    : params.questions;

  const parsedQuestions = questionsParam ? JSON.parse(questionsParam) : [];

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    setQuestions(parsedQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsEditing(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsEditing(false);
    }
  };

  const deleteCurrentQuestion = () => {
    const updated = questions.filter((_, index) => index !== currentIndex);
    setQuestions(updated);

    if (currentIndex >= updated.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setIsEditing(false);
    setDeleteModalVisible(false);
  };

  const updateQuestionText = (text: string) => {
    const updated = [...questions];
    updated[currentIndex].question = text;
    setQuestions(updated);
  };

  const updateAnswer = (answerIndex: number, text: string) => {
    const updated = [...questions];
    updated[currentIndex].answers[answerIndex] = text;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (text: string) => {
    const updated = [...questions];
    updated[currentIndex].correctAnswer = text;
    setQuestions(updated);
  };

  const saveQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module_id: moduleId,
          questions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Vragen opslaan mislukt");
      }

      router.push({
        pathname: "/loading",
        params: {
          next: "/modules",
          text: "Module wordt opgeslagen...",
        },
      } as any);
    } catch (error) {
      console.log("Save questions error:", error);
      alert(String(error));
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.screen}>
        <Text style={styles.emptyText}>Geen vragen ontvangen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Welkom</Text>
        <View style={styles.greenLine} />
      </LinearGradient>

      <View style={styles.questionTop}>
        <Text style={styles.counter}>
          Vraag {currentIndex + 1} / {questions.length}
        </Text>

        <View style={styles.iconRow}>
          <Pressable onPress={() => setDeleteModalVisible(true)}>
            <Text style={styles.icon}>⌫</Text>
          </Pressable>

          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.icon}>✎</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        {currentIndex > 0 && (
          <Pressable style={styles.leftArrow} onPress={goBack}>
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>
        )}

        {currentIndex < questions.length - 1 && (
          <Pressable style={styles.rightArrow} onPress={goNext}>
            <Text style={styles.arrowText}>›</Text>
          </Pressable>
        )}

        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              style={styles.questionInput}
              value={currentQuestion.question}
              onChangeText={updateQuestionText}
              multiline
            />
          ) : (
            <Text style={styles.question}>{currentQuestion.question}</Text>
          )}

          {currentQuestion.answers?.map((answer: string, index: number) =>
            isEditing ? (
              <TextInput
                key={index}
                style={styles.answerInput}
                value={answer}
                onChangeText={(text) => updateAnswer(index, text)}
              />
            ) : (
              <View key={index} style={styles.answerRow}>
                <View style={styles.radio} />
                <Text style={styles.answerText}>{answer}</Text>
              </View>
            )
          )}

          <View style={styles.recommendedBox}>
            <Text style={styles.recommendedTitle}>aanbevolen antwoord:</Text>

            {isEditing ? (
              <TextInput
                style={styles.correctInput}
                value={currentQuestion.correctAnswer}
                onChangeText={updateCorrectAnswer}
                multiline
              />
            ) : (
              <Text style={styles.recommendedAnswer}>
                "{currentQuestion.correctAnswer}"
              </Text>
            )}
          </View>

          {isEditing && (
            <Pressable
              style={styles.doneEditButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.doneEditText}>Wijzigingen bewaren</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Ga terug</Text>
        </Pressable>

        <Pressable style={styles.nextButton} onPress={saveQuestions}>
          <Text style={styles.nextButtonText}>Opslaan</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.homeButton}
        onPress={() => router.push("/home" as any)}
      >
        <Text style={styles.homeButtonText}>Terug naar “huis”</Text>
      </Pressable>

      <ConfirmModal
        visible={deleteModalVisible}
        title="Vraag verwijderen?"
        message="Ben je zeker dat je deze vraag wilt verwijderen?"
        cancelText="Annuleren"
        confirmText="Verwijderen"
        destructive
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={deleteCurrentQuestion}
      />
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
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    color: "#777",
    marginBottom: 14,
  },
  greenLine: {
    height: 3,
    backgroundColor: "#6BCB59",
    width: "100%",
  },
  questionTop: {
    marginTop: 58,
    marginHorizontal: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  iconRow: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    color: "#777",
    fontSize: 16,
  },
  cardWrapper: {
    marginTop: 14,
    marginHorizontal: 42,
    position: "relative",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  question: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    lineHeight: 20,
    marginBottom: 18,
  },
  questionInput: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    borderWidth: 1,
    borderColor: "#DDE5D8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    minHeight: 70,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  radio: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#E6E2E5",
    marginRight: 10,
  },
  answerText: {
    fontSize: 13,
    color: "#555",
  },
  answerInput: {
    borderWidth: 1,
    borderColor: "#DDE5D8",
    borderRadius: 8,
    padding: 9,
    marginBottom: 10,
    fontSize: 13,
    color: "#555",
  },
  recommendedBox: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
  },
  recommendedAnswer: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
    lineHeight: 18,
  },
  correctInput: {
    borderWidth: 1,
    borderColor: "#DDE5D8",
    borderRadius: 8,
    padding: 9,
    fontSize: 13,
    color: "#555",
    minHeight: 50,
  },
  doneEditButton: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  doneEditText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  leftArrow: {
    position: "absolute",
    left: -30,
    top: "45%",
    zIndex: 10,
  },
  rightArrow: {
    position: "absolute",
    right: -30,
    top: "45%",
    zIndex: 10,
  },
  arrowText: {
    fontSize: 42,
    color: "#5CBC4F",
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
    marginTop: 38,
  },
  backButton: {
    backgroundColor: "#A9CFA4",
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  nextButton: {
    backgroundColor: "#5CBC4F",
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  homeButton: {
    alignSelf: "center",
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
    borderRadius: 7,
    paddingVertical: 9,
    width: 190,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  homeButtonText: {
    color: "#5CBC4F",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginTop: 80,
  },
});