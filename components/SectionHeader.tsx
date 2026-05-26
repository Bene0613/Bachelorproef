import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <View style={styles.headerBox}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 26,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4B4B4B",
  },
});