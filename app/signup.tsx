import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Vul alle velden in");
      return;
    }

    console.log("Naam:", name);
    console.log("Email:", email);
    console.log("Password:", password);
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

        <Text style={styles.title}>Maak je account</Text>
        <Text style={styles.subtitle}>Registreer en start met oefenen</Text>

        <Text style={styles.label}>Voornaam</Text>
        <TextInput
          style={styles.input}
          placeholder="Je voornaam"
          value={name}
          onChangeText={setName}
        />

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

        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Account maken</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.link}>Al een account? Log in</Text>
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
    marginTop: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    color: "#666",
    marginTop: 12,
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