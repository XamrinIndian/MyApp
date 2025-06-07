import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setPosts } from "../store/postsSlice";
import Feather from "react-native-vector-icons/Feather";
import PostCard from "../components/PostCard";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useFocusEffect(
    useCallback(() => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId || "",
            userName: data.userName || "",
            userImage: data.userImage || "",
            content: data.content || "",
            imageBase64: data.imageBase64 || null,
            likes: data.likes || 0,
            likedByUser: data.likedByUser || false,
            createdAt: data.createdAt?.toMillis?.() || Date.now(),
          };
        });

        console.log("Fetched posts: ", postsData);
        dispatch(setPosts(postsData));
      });

      return () => unsubscribe();
    }, [dispatch])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          style={styles.plusCircle}
          onPress={() => navigation.navigate("CreatePostScreen")}
        >
          <Feather name="plus" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.userRow}>
        <Feather name="user" size={24} color="#333" />
        <Text style={styles.userEmailBig}>{user?.displayName ?? "Anonymous"}</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  userEmailBig: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
