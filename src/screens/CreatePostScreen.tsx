import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { launchImageLibrary } from "react-native-image-picker";
import CustomButton from "../components/CustomButton";
import Feather from "react-native-vector-icons/Feather";

export default function CreatePostScreen({ navigation }: { navigation: any }) {
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      quality: 0.8,
    });

    if (result.didCancel) return;

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri || null);
      setBase64Image(asset.base64 || null);
    } else {
      Alert.alert("Image selection failed", "Please try again.");
    }
  };

  const handlePost = async () => {
    if (!user || content.trim() === '') {
      Alert.alert("Error", "Content and login are required.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        content,
        imageBase64: base64Image,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Failed to post", error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Post</Text>

      <TextInput
        placeholder="What's on your mind?"
        value={content}
        placeholderTextColor={"#000"}
        onChangeText={setContent}
        multiline
        style={styles.textInput}
      />

      <CustomButton title="Add Image" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <CustomButton title="Post" onPress={handlePost} />

      {/* Loader Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    color: "#000",
    marginVertical: 30,
    fontWeight: "bold",
  },
  textInput: {
    color: "#000",
    height: 150,
    borderWidth: 1,
    marginBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderColor: "#000",
    borderRadius: 10,
    textAlignVertical: "top",
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 10,
    borderRadius: 8,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
