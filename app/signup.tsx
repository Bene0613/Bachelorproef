import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<
    "leerling" | "leerkracht" | ""
  >("");

const handleSignup = async () => {
  if (!name || !email || !password || !role) {
    alert("Vul alle velden in");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const user = data.user;

    if (!user) {
      throw new Error("Account kon niet worden aangemaakt");
    }

    const { error: profileError } = await supabase
  .from("profiles")
  .insert({
    id: user.id,
    email,
    name,
    role,
    school_name: "Sint-Guido Instituut",
    school_email: email,
    study_program:
      role === "leerling"
        ? "Wetenschappen Wiskunde"
        : "Leerkracht",
    school_verified: false,
  });

    if (profileError) {
      throw profileError;
    }

    if (role === "leerling") {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(teacher-tabs)/home");
    }
  } catch (error) {
    console.log("Signup error:", error);
    alert(String(error));
  }
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

        <Text style={styles.subtitle}>
          Registreer en start met oefenen
        </Text>

        <Text style={styles.label}>Voornaam</Text>

        <TextInput
          style={styles.input}
          placeholder="Je voornaam"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Schoolmail of eigen email
        </Text>

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

        <View style={styles.radioRow}>
          <Pressable
            style={styles.radioOption}
            onPress={() => setRole("leerkracht")}
          >
            <View
              style={[
                styles.radioOuter,
                role === "leerkracht" &&
                  styles.radioOuterActive,
              ]}
            >
              {role === "leerkracht" && (
                <View style={styles.radioInner} />
              )}
            </View>

            <Text style={styles.radioText}>
              Ik ben een leerkracht
            </Text>
          </Pressable>

          <Pressable
            style={styles.radioOption}
            onPress={() => setRole("leerling")}
          >
            <View
              style={[
                styles.radioOuter,
                role === "leerling" &&
                  styles.radioOuterActive,
              ]}
            >
              {role === "leerling" && (
                <View style={styles.radioInner} />
              )}
            </View>

            <Text style={styles.radioText}>
              Ik ben een leerling
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>
            Ga verder
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.link}>
            Al een account? Klik hier
          </Text>
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
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    color: "#444",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
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

  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 10,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  radioOuterActive: {
    borderColor: "#5CBC4F",
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5CBC4F",
  },

  radioText: {
    fontSize: 12,
    color: "#666",
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