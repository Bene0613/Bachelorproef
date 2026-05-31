import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import { supabase } from "../../lib/supabase";

type Profile = {
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
};

export default function SettingsScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    avatar_url: null,
  });

  const fetchProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, role, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Fetch settings profile error:", error);
      return;
    }

    setProfile({
      name: data.name || "",
      email: data.email || user.email || "",
      role: data.role || "",
      avatar_url: data.avatar_url || null,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  return (
    <View style={styles.screen}>
      <PageHeader title="Instellingen" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image
            source={
              profile.avatar_url
                ? {
                    uri: profile.avatar_url,
                  }
                : require("../../assets/images/user.jpg")
            }
            style={styles.avatar}
          />

          <View>
            <Text style={styles.role}>
              {profile.role ===
              "leerkracht"
                ? "Leerkracht"
                : "Student"}
            </Text>

            <Text style={styles.name}>
              {profile.name ||
                "Gebruiker"}
            </Text>

            <Text style={styles.email}>
              {profile.email ||
                "Geen e-mail"}
            </Text>

            <Pressable
              style={styles.profileButton}
              onPress={() =>
                router.push(
                  "/profile" as any
                )
              }
            >
              <Text
                style={
                  styles.profileButtonText
                }
              >
                Profiel wijzigen
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.menuGroup}>
          <MenuItem
            label="Schoolinformatie"
            route="/school-info"
          />

          <MenuItem
            label="Taalkeuze"
            route="/taal"
          />

          <MenuItem
            label="E-mailmeldingen"
            route="/meldingen"
          />

          <MenuItem label="Profielverificatie" />
        </View>

        <View style={styles.menuGroup}>
          <MenuItem
            label="Wachtwoord wijzigen"
            route="/wachtwoord"
          />

          <MenuItem
            label="Help & steun"
            route="/help"
          />

          <MenuItem
            label="Cache wissen"
            route="/cache"
          />

          <MenuItem
            label="Privacybeleid"
            route="/privacybeleid"
          />
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await supabase.auth.signOut();

            router.replace("/");
          }}
        >
          <Text style={styles.logout}>
            ↪
          </Text>

          <Text style={styles.logoutText}>
            Uitloggen
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  label,
  route,
}: {
  label: string;
  route?: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.menuItem}
      onPress={() =>
        route &&
        router.push(route as any)
      }
    >
      <Text style={styles.menuText}>
        {label}
      </Text>

      <Text style={styles.chevron}>
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingTop: 24,
    paddingBottom: 120,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 34,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 26,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 16,
  },

  role: {
    fontSize: 12,
    color: "#777",
  },

  name: {
    fontSize: 20,
    color: "#555",
    marginTop: 2,
  },

  email: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
    marginBottom: 10,
  },

  profileButton: {
    backgroundColor: "#5CBC4F",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },

  profileButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  menuGroup: {
    marginBottom: 24,
  },

  menuItem: {
    height: 50,
    backgroundColor: "#fff",
    marginHorizontal: 34,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingHorizontal: 18,
  },

  menuText: {
    fontSize: 14,
    color: "#555",
  },

  chevron: {
    fontSize: 22,
    color: "#999",
  },

  logoutButton: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 12,
  },

  logout: {
    color: "#E56D6D",
    fontSize: 32,
  },

  logoutText: {
    marginTop: 4,
    fontSize: 13,
    color: "#E56D6D",
    fontWeight: "600",
  },
});