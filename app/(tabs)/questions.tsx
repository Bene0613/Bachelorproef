import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const questions = [
  {
    question: "Wat bestudeert de wetenschap chemie vooral?",
    answers: [
      "Alleen levende organismen",
      "Stoffen: hun samenstelling en reacties",
      "Ruimte: Sterren en planeten",
      "Alleen het weer en klimaat",
    ],
    recommended: "Stoffen: hun samenstelling en reacties",
  },
  {
    question: "Wat gebeurt er meestal bij een chemische reactie?",
    answers: [
      "Er ontstaan nieuwe stoffen",
      "De massa verdwijnt volledig",
      "Alle stoffen worden water",
      "Er verandert helemaal niets",
    ],
    recommended: "Er ontstaan nieuwe stoffen",
  },
];

export default function QuestionsScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
        <Text style={styles.counter}>Vraag {currentIndex + 1} / 10</Text>
        <Text style={styles.icons}>⌫  ✎</Text>
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
          <Text style={styles.question}>{currentQuestion.question}</Text>

          {currentQuestion.answers.map((answer) => (
            <View key={answer} style={styles.answerRow}>
              <View style={styles.radio} />
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          ))}

          <View style={styles.recommendedBox}>
            <Text style={styles.recommendedTitle}>aanbevolen antwoorden:</Text>
            <Text style={styles.recommendedNumber}>{currentIndex + 2}</Text>
            <Text style={styles.recommendedAnswer}>
              "{currentQuestion.recommended}"
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Ga terug</Text>
        </Pressable>

        <Pressable
  style={styles.nextButton}
  onPress={() => router.push("/loading" as any)}
>
          <Text style={styles.nextButtonText}>Ga verder</Text>
        </Pressable>
      </View>

      <Pressable style={styles.homeButton} onPress={() => router.push("/home" as any)}>
        <Text style={styles.homeButtonText}>Terug naar “huis”</Text>
      </Pressable>
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
  icons: {
    position: "absolute",
    right: 0,
    color: "#777",
    fontSize: 13,
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
  recommendedNumber: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  recommendedAnswer: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
    lineHeight: 18,
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
});