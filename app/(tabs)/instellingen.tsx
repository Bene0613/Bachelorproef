import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAF6E5", "#FFF9FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
    >
  <Text style={styles.title}>Instellingen</Text>
</LinearGradient>

<View style={styles.greenLine} />

      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/images/user.jpg")}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.role}>Student</Text>
          <Text style={styles.name}>Paloma Lima</Text>
          <Text style={styles.email}>palomalima@sgi.be</Text>

          <Pressable style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Profiel wijzigen</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.menuGroup}>
        <MenuItem label="Schoolinformatie" route="/school-info" />
        <MenuItem label="Taalkeuze" route="/taal" />
        <MenuItem label="E-mailmeldingen" route="/meldingen" />
        <MenuItem label="Profielverificatie" />
      </View>

      <View style={styles.menuGroup}>
        <MenuItem label="Wachtwoord wijzigen"  route="/wachtwoord" />
        <MenuItem label="Help & steun" route="/help"/>
        <MenuItem label="Cache wissen" route="/cache" />
        <MenuItem label="Privacybeleid" route="/privacybeleid"  />
      </View>

      <Text style={styles.logout}>↪</Text>
    </View>
  );
}

function MenuItem({ label, route }: { label: string; route?: string }) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.menuItem}
      onPress={() => route && router.push(route as any)}
    >
      <Text style={styles.menuText}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9FC",
    paddingTop: 28,
    paddingHorizontal: 28,
  },
  header: {
  height: 100,
  justifyContent: "flex-end",
  alignItems: "center",
  paddingBottom: 12,
},
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#777",
    marginBottom: 24,
  },
  greenLine: {
    height: 3,
    backgroundColor: "#6BCB59",
    marginHorizontal: -28,
    marginBottom: 22,
  },
  profileCard: {
    alignSelf: "center",
    width: "82%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 16,
  },
  role: {
    fontSize: 11,
    color: "#777",
  },
  name: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  email: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  profileButton: {
    marginTop: 6,
    backgroundColor: "#5CBC4F",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  menuGroup: {
    marginBottom: 24,
  },
  menuItem: {
    height: 42,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 13,
    color: "#555",
  },
  chevron: {
    fontSize: 22,
    color: "#999",
  },
  logout: {
    textAlign: "center",
    color: "#E26767",
    fontSize: 22,
    marginTop: -10,
  },
});