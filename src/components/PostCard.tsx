import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface PostCardProps {
  item: {
    id: string;
    content?: string;
    imageBase64?: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  return (
    <View style={styles.postBox}>
      <View style={styles.postContentBox}>
        <Text style={styles.postText}>{item.content || "No content"}</Text>
        {item.imageBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
            style={styles.postImage}
          />
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="heart" size={20} color="#e74c3c" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  postBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 2,
  },
  postContentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
  },
  postText: {
    fontSize: 16,
    color: "#444",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 16,
    color: "#555",
  },
});
