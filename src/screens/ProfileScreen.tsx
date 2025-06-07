import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { auth, db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import type { RootState, AppDispatch } from "../store";
import { setUser } from "../store/authSlice";
import CustomButton from "../components/CustomButton";
import PostCard from "../components/PostCard";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  UpdateProfileScreen: undefined;
};

interface Post extends DocumentData {
  id: string;
  [key: string]: any;
}

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "posts"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const posts: Post[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
          };
        });
        setUserPosts(posts);
      });

      return unsubscribe;
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(setUser(null));
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <Feather
          name="edit"
          size={22}
          color="#333"
          onPress={() => navigation.navigate("UpdateProfileScreen")}
        />
      </View>

      <View style={styles.userInfo}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <Feather name="user" size={40} color="#333" />
        )}
        <Text style={styles.userEmail}>
          {user?.displayName ?? "Anonymous"}
        </Text>
      </View>

      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: "red",
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            No posts available
          </Text>
        }
        renderItem={({ item }) => <PostCard item={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <CustomButton title="Log out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 30,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
