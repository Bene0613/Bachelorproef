import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  breadcrumbMain?: string;
  breadcrumbActive?: string;
};

export default function PageHeader({
  title,
  breadcrumbMain,
  breadcrumbActive,
}: Props) {
  return (
    <>
      <LinearGradient
        colors={[
          "#FFFFFF",
          "#FBFCF2",
          "#F7FAEB",
          "#F2F9E5",
          "#EDFCD6",
          "#E1FFB4",
        ]}
        locations={[0.09, 0.34, 0.49, 0.60, 0.74, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>

        {(breadcrumbMain || breadcrumbActive) && (
          <View style={styles.breadcrumbRow}>
            <Text style={styles.breadcrumbMain}>
              {breadcrumbMain}
            </Text>

            <Text style={styles.breadcrumbDivider}> / </Text>

            <Text style={styles.breadcrumbActive}>
              {breadcrumbActive}
            </Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.lineContainer}>
        <View style={styles.greenLine} />
        <View style={styles.yellowLine} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 138,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 14,
    marginHorizontal: -26,
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#7B7678",
    letterSpacing: -1,
    marginBottom: 2,
  },

  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  breadcrumbMain: {
    fontSize: 14,
    color: "#4E4A4C",
    textDecorationLine: "underline",
  },

  breadcrumbDivider: {
    fontSize: 18,
    color: "#444",
    marginHorizontal: 5,
  },

  breadcrumbActive: {
    fontSize: 14,
    color: "#66C24F",
    textDecorationLine: "underline",
  },

  lineContainer: {
    marginHorizontal: -26,
  },

  greenLine: {
    height: 4,
    backgroundColor: "#69B84F",
  },

  yellowLine: {
    height: 2,
    backgroundColor: "#D9D948",
  },
});