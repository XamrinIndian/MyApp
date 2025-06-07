import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { setUser } from "../store/authSlice";
import type { AppDispatch } from "../store"; 
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    dispatch(setUser({
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '', 
      photoURL: user.photoURL ?? ''
    }));

    } catch (e: any) {
      Alert.alert("Login failed", e?.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigation.navigate("SignupScreen" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor={'#000'}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholderTextColor={'#000'}
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton title="Login" onPress={handleLogin} />
      <CustomButton title="Sign up" onPress={handleSignupRedirect} />
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
};

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
    color:'#000',
  },
  input: {
    color:'#000',
    width: "100%",
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
  },
  signUpText: {
    color: "#0000EE",
    fontSize: 16,
  },
  containBtn: {
    marginVertical: 20,
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
