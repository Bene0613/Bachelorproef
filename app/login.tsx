import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Vul alle velden in");
      return;
    }

     router.push("/home" as any);
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require("../assets/images/FINAL-LOGO.png")}
        style={styles.logo}
      />

      <Text style={styles.brand}>ModuleMind</Text>

      <View style={styles.card}>
        <Text style={styles.hand}>👋</Text>

        <Text style={styles.title}>Welkom terug</Text>
        <Text style={styles.subtitle}>
          Log in en ga verder met je oefeningen
        </Text>

        <Text style={styles.label}>Schoolmail</Text>
        <TextInput
          style={styles.input}
          placeholder="naam@schoolnaam.be"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Wachtwoord</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.forgot}>Wachtwoord vergeten?</Text>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ga verder</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Geen account? Klik hier</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFDF2",
    paddingTop: 64,
    paddingHorizontal: 18,
  },
  logo: {
    width: 42,
    height: 42,
    alignSelf: "center",
    resizeMode: "contain",
  },
  brand: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 24,
    color: "#222",
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#70BD63",
    borderRadius: 24,
    backgroundColor: "#FFF9FC",
    padding: 24,
  },
  hand: {
    textAlign: "center",
    fontSize: 46,
    marginTop: 22,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#8ED27A",
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 13,
  },
  forgot: {
    fontSize: 11,
    color: "#777",
    marginTop: 8,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 7,
    marginTop: 28,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 11,
    color: "#777",
  },
});