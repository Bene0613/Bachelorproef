import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ConfirmModal from "../components/ConfirmModal";

import { supabase } from "../lib/supabase";

type Profile = {
  name: string;
  email: string;
  role: "leerling" | "leerkracht" | string;
  avatar_url: string | null;
  school_name: string | null;
  school_email: string | null;
  study_program: string | null;
  school_verified: boolean | null;
};

const plans = [
  {
    title: "STARTER",
    price: "€0/maand",
    label: "Gratis",
    details: "5 oefeningen per dag • basis AI • beperkte uploads",
  },
  {
    title: "STUDENT",
    price: "€9/maand",
    label: "",
    details: "Onbeperkte oefeningen • slimme AI • exam mode",
  },
  {
    title: "SCHOOL & LEERKRACHTEN",
    price: "Offerte",
    label: "",
    details: "Klassenbeheer • gedeelde modules • analytics",
  },
];

export default function ProfileScreen() {
  const [currentPlan, setCurrentPlan] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
const [deletePhotoModalVisible, setDeletePhotoModalVisible] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    avatar_url: null,
    school_name: null,
    school_email: null,
    study_program: null,
    school_verified: false,
  });

  const plan = plans[currentPlan];

  const deleteProfileImage = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Geen gebruiker gevonden");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (error) {
      console.log("Delete avatar error:", error);
      alert(error.message);
      return;
    }

    setProfileImage(null);
    setProfile((prev) => ({
      ...prev,
      avatar_url: null,
    }));

    alert("Profielfoto verwijderd");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "name, email, role, avatar_url, school_name, school_email, study_program, school_verified"
        )
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Fetch profile error:", error);
        return;
      }

      setProfile({
        name: data.name || "",
        email: data.email || user.email || "",
        role: data.role || "",
        avatar_url: data.avatar_url || null,
        school_name: data.school_name || null,
        school_email: data.school_email || null,
        study_program: data.study_program || null,
        school_verified: data.school_verified ?? false,
      });

      if (data.role === "leerkracht") {
         setCurrentPlan(2);
        } else {
           setCurrentPlan(1);
        }

      setProfileImage(data.avatar_url || null);
    };

    fetchProfile();
  }, []);

  const uploadProfileImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `profile-${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.log("Supabase upload error:", error);
        alert(error.message);
        return;
      }

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        alert("Geen gebruiker gevonden");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.publicUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        console.log("Avatar URL update error:", updateError);
        alert(updateError.message);
        return;
      }

      setProfileImage(data.publicUrl);
      setProfile((prev) => ({
        ...prev,
        avatar_url: data.publicUrl,
      }));

      alert("Profielfoto opgeslagen");
    } catch (error) {
      console.log("Image upload error:", error);
      alert("Fout bij upload");
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Toegang tot galerij is nodig om een foto te kiezen.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    await uploadProfileImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera toegang is nodig om een foto te nemen.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    await uploadProfileImage(result.assets[0].uri);
  };

  const nextPlan = () => {
    setCurrentPlan((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setCurrentPlan((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        style={styles.header}
      >
        <Text style={styles.title}>Instellingen</Text>
      </LinearGradient>

      <View style={styles.greenLine} />

      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/images/user.jpg")
            }
            style={styles.avatar}
          />

          <Pressable style={styles.editIcon} onPress={pickImage}>
            <Text style={styles.editText}>✎</Text>
          </Pressable>
        </View>

        <Text style={styles.role}>
          {profile.role === "leerkracht" ? "Leerkracht" : "Student"}
        </Text>

        <View style={styles.photoButtons}>
          <Pressable style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Kies foto</Text>
          </Pressable>

          <Pressable style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonText}>Neem foto</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Persoonlijke info</Text>

      <View style={styles.infoCard}>
        <InfoRow label="Voornaam:" value={profile.name || "Niet ingesteld"} />
        <InfoRow label="E-mail:" value={profile.email || "Niet ingesteld"} />

        <InfoRow
          label="Rol:"
          value={profile.role === "leerkracht" ? "Leerkracht" : "Leerling"}
        />

        <InfoRow
          label="School:"
          value={profile.school_name || "Niet ingesteld"}
        />

        <InfoRow
          label="Schoolemail:"
          value={profile.school_email || "Niet ingesteld"}
        />

        <InfoRow
          label="Richting/functie:"
          value={profile.study_program || "Niet ingesteld"}
        />

        <InfoRow
          label="Verificatie:"
          value={profile.school_verified ? "Bevestigd" : "In afwachting"}
        />
      </View>

      <Text style={styles.planTitle}>ModuleMind Plans</Text>

      <Text style={styles.planSubtitle}>
        Kies het abonnement dat bij jou past.
      </Text>

      <View style={styles.carouselRow}>
        <Pressable onPress={prevPlan}>
          <Text style={styles.arrow}>‹</Text>
        </Pressable>

        <View style={styles.planCard}>
          <View style={styles.planBadge}>
  <Text style={styles.planBadgeText}>
    {currentPlan === 1 && profile.role === "leerling"
      ? "HUIDIGE"
      : currentPlan === 2 && profile.role === "leerkracht"
      ? "HUIDIGE"
      : plan.label}
  </Text>
</View>

          <Text style={styles.planName}>{plan.title}</Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planDetails}>{plan.details}</Text>
        </View>

        <Pressable onPress={nextPlan}>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <Pressable style={styles.unsubscribeButton}>
        <Text style={styles.unsubscribeText}>
          {plan.title === "STUDENT" ? "Unsubscribe" : "Subscribe"}
        </Text>
      </Pressable>

      <View style={styles.dots}>
        {plans.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPlan === index && styles.dotActive]}
          />
        ))}
      </View>
      
        <ConfirmModal
  visible={deletePhotoModalVisible}
  title="Profielfoto verwijderen?"
  message="Ben je zeker dat je je profielfoto wilt verwijderen?"
  cancelText="Annuleren"
  confirmText="Verwijderen"
  destructive
  onCancel={() => setDeletePhotoModalVisible(false)}
  onConfirm={() => {
    setDeletePhotoModalVisible(false);
    deleteProfileImage();
  }}
/>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
    paddingHorizontal: 26,
    paddingTop: 28,
  },

  header: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 12,
    marginHorizontal: -26,
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
    marginBottom: 18,
  },

  profileCard: {
    width: "78%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 10,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },

  editIcon: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#5CBC4F",
    justifyContent: "center",
    alignItems: "center",
  },

  editText: {
    color: "#5CBC4F",
    fontSize: 12,
    fontWeight: "700",
  },

  role: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },

  photoButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
  },

  photoButton: {
    backgroundColor: "#5CBC4F",
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  photoButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  deletePhotoButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E56D6D",
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  deletePhotoText: {
    color: "#E56D6D",
    fontSize: 11,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 18,
    marginBottom: 22,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  infoLabel: {
    width: 112,
    fontSize: 12,
    color: "#555",
  },

  infoValue: {
    flex: 1,
    fontSize: 12,
    color: "#555",
  },

  planTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  planSubtitle: {
    fontSize: 10,
    color: "#555",
    marginBottom: 14,
  },

  carouselRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: 34,
    color: "#5CBC4F",
    fontWeight: "700",
  },

  planCard: {
    flex: 1,
    minHeight: 70,
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    position: "relative",
  },

  planBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#D9D948",
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },

  planBadgeText: {
    fontSize: 8,
    color: "#fff",
    fontWeight: "700",
  },

  planName: {
    fontSize: 17,
    color: "#555",
    marginBottom: 2,
  },

  planPrice: {
    fontSize: 11,
    color: "#777",
    marginBottom: 4,
  },

  planDetails: {
    fontSize: 9,
    color: "#777",
  },

  unsubscribeButton: {
    alignSelf: "center",
    backgroundColor: "#5CBC4F",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
  },

  unsubscribeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#777",
  },

  dotActive: {
    backgroundColor: "#5CBC4F",
    borderColor: "#5CBC4F",
  },
});