import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";
import { launchImageLibrary } from "react-native-image-picker";
import CustomButton from "../components/CustomButton";
import Feather from "react-native-vector-icons/Feather";
import type { RootState, AppDispatch } from "../store";

export default function UpdateProfileScreen({ navigation }: { navigation: any }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState(user?.displayName ?? "");
  const [image, setImage] = useState<string | null>(user?.photoURL || null);
  const [loading, setLoading] = useState(false); 

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      includeBase64: true,
      quality: 0.8,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri || null);
    }
  };

  const handleUpdate = async () => {
    if (!auth.currentUser || !user) return;

    setLoading(true); 
    try {
      const finalPhotoURL = image ?? auth.currentUser.photoURL ?? "";

      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: finalPhotoURL,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username,
        photoURL: finalPhotoURL,
      });

      dispatch(
        setUser({
          ...user,
          displayName: username,
          photoURL: finalPhotoURL,
        })
      );

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (err: any) {
      console.log("errrrr", err);
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Feather name="arrow-left" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Update Profile</Text>

      {image && <Image source={{ uri: image }} style={styles.avatar} />}

      <CustomButton title="Choose Image" onPress={pickImage} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, { backgroundColor: "#eee" }]}
        value={user?.email || ""}
        editable={false}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <CustomButton title="Save Changes" onPress={handleUpdate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 70,
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 20,
  },
});
