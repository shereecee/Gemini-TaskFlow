import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { analyzeImage, getAnalysisPrompt } from "../lib/gemini";

function parseAnalysisText(text) {
  const trimmedText = text.trim();
  const withoutFences = trimmedText
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(withoutFences);
  } catch {
    const jsonStart = withoutFences.indexOf("{");
    const jsonEnd = withoutFences.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      return JSON.parse(withoutFences.slice(jsonStart, jsonEnd + 1));
    }

    throw new Error("Gemini response was not valid JSON");
  }
}

export default function ResultScreen() {
  const router = useRouter();
  const { base64Image, analysisMode } = useLocalSearchParams();
  const imageData = Array.isArray(base64Image) ? base64Image[0] : base64Image;
  const selectedMode = Array.isArray(analysisMode)
    ? analysisMode[0]
    : analysisMode;
  const previewSource = imageData
    ? { uri: `data:image/jpeg;base64,${imageData}` }
    : null;
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const runAnalysis = useCallback(async () => {
    if (!imageData) {
      setError("Missing image data. Please go back and try again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeImage(
        imageData,
        getAnalysisPrompt(selectedMode),
      );
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      console.log("Gemini raw result:", JSON.stringify(result).slice(0, 1000));

      if (!textPart) {
        throw new Error("Empty response from Gemini");
      }

      setAnalysis(parseAnalysisText(textPart));
    } catch (err) {
      console.log("Analysis failed for mode:", selectedMode);
      console.log("Analysis error:", err?.message || String(err));
      setError(
        err?.message?.includes("Gemini request failed")
          ? err.message
          : "Could not analyze this image. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [imageData, selectedMode]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={runAnalysis}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {previewSource ? (
        <Image source={previewSource} style={styles.resultImage} />
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objects</Text>
        {Array.isArray(analysis.objects) && analysis.objects.length > 0 ? (
          analysis.objects.map((obj, index) => (
            <Text key={`${obj}-${index}`} style={styles.listItem}>
              • {obj}
            </Text>
          ))
        ) : (
          <Text style={styles.bodyText}>No objects found.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Context</Text>
        <Text style={styles.bodyText}>{analysis.context}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activities</Text>
        <Text style={styles.bodyText}>{analysis.activities}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        <Text style={styles.bodyText}>{analysis.recommendations}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  resultImage: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: "#E5E7EB",
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2A44",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    color: "#5A6472",
  },
  errorText: {
    color: "#B3261E",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#5B3FA3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#5A6472",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#1F2A44",
  },
  listItem: {
    fontSize: 15,
    marginTop: 4,
    color: "#2B2F38",
  },
  bodyText: {
    fontSize: 15,
    marginTop: 4,
    color: "#2B2F38",
  },
});
