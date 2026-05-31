import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  cancelText = "Annuleren",
  confirmText = "Doorgaan",
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmButton,
                destructive && styles.destructiveButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFF9FC",
    borderRadius: 16,
    padding: 22,
    borderWidth: 1.5,
    borderColor: "#EAF6E5",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },

  message: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 22,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  cancelButton: {
    borderWidth: 1.5,
    borderColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  cancelText: {
    color: "#5CBC4F",
    fontSize: 13,
    fontWeight: "700",
  },

  confirmButton: {
    backgroundColor: "#5CBC4F",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  destructiveButton: {
    backgroundColor: "#E56D6D",
  },

  confirmText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});