import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const previewUri = Array.isArray(photoUri) ? photoUri[0] : photoUri;

  return (
    <View style={styles.container}>
      <Image source={{ uri: previewUri }} style={styles.preview} />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() =>
            router.push({
              pathname: "/result",
              params: { photoUri: previewUri },
            })
          }
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: "#5A6472",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: "#5B3FA3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
