import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import type { AppDispatch } from "../store";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { updateProfile } from "firebase/auth";


const SignupScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Validation Error", "Valid email is required.");
      return false;
    }

    if (!password || password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: username,
      });
  
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: new Date().toISOString(),
        displayName: username,
      });
  
      dispatch(setUser({
        uid: user.uid,
        email,
        displayName: username,
        photoURL: ''
      }));
  
      Alert.alert("Success", "Account created successfully!");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Signup failed", e?.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="words"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <CustomButton title="Create Account" onPress={handleSignup} />
          <CustomButton title="Already have an account? Login" onPress={handleLoginRedirect} />
        </>
      )}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
  },
});
