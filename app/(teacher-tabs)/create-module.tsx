import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import PageHeader from "../../components/PageHeader";
import SectionHeader from "../../components/SectionHeader";
import { supabase } from "../../lib/supabase";

const API_URL = "http://localhost:3000";

const subjects = [
  "Wiskunde",
  "Fysica",
  "Chemie",
  "Informatica",
  "Techniek",
  "Anders",
];

const subSubjects = [
  "Meetkunde",
  "Algebra",
  "Statistiek",
  "Mechanica",
  "Elektriciteit",
  "Anders",
];

export default function CreateModuleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const uploadId = Array.isArray(params.uploadId)
    ? params.uploadId[0]
    : params.uploadId;

  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);

  const [subSubject, setSubSubject] = useState("");
  const [customSubSubject, setCustomSubSubject] = useState("");
  const [subSubjectOpen, setSubSubjectOpen] = useState(false);

  const finalSubject = subject === "Anders" ? customSubject : subject;
  const finalSubSubject =
    subSubject === "Anders" ? customSubSubject : subSubject;

  const handleNext = async () => {
  if (!uploadId) {
    alert("Geen PDF gevonden. Ga terug en kies eerst een PDF.");
    return;
  }

  if (!finalSubject) {
    alert("Kies of typ een vak");
    return;
  }

  if (!finalSubSubject) {
    alert("Kies of typ een subvak");
    return;
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Geen gebruiker gevonden");
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const role = profileData?.role || "leerling";

    const response = await fetch(`${API_URL}/modules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: finalSubject,
        sub_subject: finalSubSubject,

        user_id: role === "leerling" ? user.id : null,
        created_by: user.id,
        owner_role: role,
        visibility: role === "leerkracht" ? "class" : "private",
      }),
    });

    const moduleData = await response.json();

    if (!response.ok) {
      throw new Error(moduleData.error || "Module opslaan mislukt");
    }

    const qRes = await fetch(`${API_URL}/generate-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: finalSubject,
        subSubject: finalSubSubject,
        uploadId,
      }),
    });

    const qData = await qRes.json();

    if (!qRes.ok) {
      throw new Error(qData.error || "Vragen genereren mislukt");
    }

    router.push({
      pathname: "/questions",
      params: {
        moduleId: moduleData.id,
        questions: JSON.stringify(qData.questions),
      },
    } as any);
  } catch (error) {
    console.log(error);
    alert(String(error));
  }
};

  return (
    <View style={styles.screen}>
      <PageHeader title="Modules" />

      <SectionHeader title="Nieuwe module" />

      <Text style={styles.description}>
        Maak een module waarin alle oefeningen voor dit vak zullen zitten.
      </Text>

      <View style={styles.iconBox}>
        <Text style={styles.icon}>?</Text>
      </View>

      <Text style={styles.label}>Vak</Text>

      <Pressable
        style={styles.inputBox}
        onPress={() => setSubjectOpen(!subjectOpen)}
      >
        <Text style={subject ? styles.value : styles.placeholder}>
          {subject || "bv: Wiskunde"}
        </Text>
      </Pressable>

      {subjectOpen && (
        <View style={styles.dropdown}>
          {subjects.map((item) => (
            <Pressable
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                setSubject(item);
                setSubjectOpen(false);
              }}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {subject === "Anders" && (
        <TextInput
          style={styles.inputBox}
          placeholder="Typ je vak"
          placeholderTextColor="#999"
          value={customSubject}
          onChangeText={setCustomSubject}
        />
      )}

      <Text style={styles.label}>Subvak</Text>

      <Pressable
        style={styles.inputBox}
        onPress={() => setSubSubjectOpen(!subSubjectOpen)}
      >
        <Text style={subSubject ? styles.value : styles.placeholder}>
          {subSubject || "bv: Meetkunde"}
        </Text>
      </Pressable>

      {subSubjectOpen && (
        <View style={styles.dropdown}>
          {subSubjects.map((item) => (
            <Pressable
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                setSubSubject(item);
                setSubSubjectOpen(false);
              }}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {subSubject === "Anders" && (
        <TextInput
          style={styles.inputBox}
          placeholder="Typ je subvak"
          placeholderTextColor="#999"
          value={customSubSubject}
          onChangeText={setCustomSubSubject}
        />
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Ga terug</Text>
        </Pressable>

        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Ga verder</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.homeButton}
        onPress={() => router.push("/home" as any)}
      >
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

  description: {
    marginTop: 10,
    marginHorizontal: 66,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },

  iconBox: {
    width: 130,
    height: 130,
    borderRadius: 14,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#6BCB59",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 42,
  },

  icon: {
    color: "#fff",
    fontSize: 22,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginHorizontal: 34,
    marginBottom: 8,
  },

  inputBox: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2DDE0",
    marginHorizontal: 34,
    marginBottom: 22,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  placeholder: {
    color: "#999",
    fontSize: 14,
  },

  value: {
    color: "#333",
    fontSize: 14,
  },

  dropdown: {
    marginHorizontal: 34,
    marginTop: -18,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2DDE0",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EEF0",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: -6,
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