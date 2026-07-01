import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResultRoute() {
  const router = useRouter();
  const { base64Image } = useLocalSearchParams();
  const imageData = Array.isArray(base64Image) ? base64Image[0] : base64Image;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <Text style={styles.body}>
        Base64 image received: {imageData ? "yes" : "no"}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1E293B",
  },
  body: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2E5BBA",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
