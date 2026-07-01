import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { imageToBase64 } from "../lib/gemini";

export default function PreviewScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const rawPreviewUri = Array.isArray(photoUri) ? photoUri[0] : photoUri;
  const previewUri = rawPreviewUri ? decodeURIComponent(rawPreviewUri) : null;
  const [loadingMode, setLoadingMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleAnalyzeMode(analysisMode) {
    if (!previewUri) return;

    setLoadingMode(analysisMode);
    setErrorMessage(null);

    try {
      const base64Image = await imageToBase64(previewUri);
      console.log(base64Image.length);
      router.push({
        pathname: "/result",
        params: { base64Image, analysisMode },
      });
    } catch {
      setErrorMessage("Could not prepare this image. Please try again.");
    } finally {
      setLoadingMode(null);
    }
  }

  return (
    <View style={styles.container}>
      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.preview} />
      ) : (
        <View style={styles.previewFallback}>
          <Text style={styles.previewFallbackText}>
            Preview image not available.
          </Text>
        </View>
      )}
      {loadingMode ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>
            Preparing {loadingMode} analysis...
          </Text>
        </View>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <View style={styles.analysisLabelWrap}>
        <Text style={styles.analysisLabel}>Choose analysis</Text>
      </View>
      <View style={styles.analysisRow}>
        <TouchableOpacity
          style={[
            styles.analysisButton,
            loadingMode ? styles.analysisButtonDisabled : null,
          ]}
          disabled={!!loadingMode}
          onPress={() => handleAnalyzeMode("academic")}
        >
          <Text style={styles.buttonText}>Academic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.analysisButton,
            loadingMode ? styles.analysisButtonDisabled : null,
          ]}
          disabled={!!loadingMode}
          onPress={() => handleAnalyzeMode("safety")}
        >
          <Text style={styles.buttonText}>Safety</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.analysisButton,
            loadingMode ? styles.analysisButtonDisabled : null,
          ]}
          disabled={!!loadingMode}
          onPress={() => handleAnalyzeMode("inventory")}
        >
          <Text style={styles.buttonText}>Inventory</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.retakeButton}
        disabled={!!loadingMode}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Retake</Text>
      </TouchableOpacity>
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
  previewFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  previewFallbackText: {
    color: "#E5E7EB",
    fontSize: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    zIndex: 2,
  },
  loadingText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  errorText: {
    color: "#FCA5A5",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  analysisLabelWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  analysisLabel: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  retakeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#5A6472",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  analysisButton: {
    flex: 1,
    backgroundColor: "#5B3FA3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    opacity: 1,
  },
  analysisButtonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
