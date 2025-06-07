import React from "react";
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.containBtn} onPress={onPress}>
      <Text style={styles.loginButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containBtn: {
    marginVertical: 20,
    borderWidth: 0.5,
    borderColor: "black",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
  },
  loginButtonText: {
    color: "#000",
    fontWeight:'bold',
    fontSize: 18,
  },
});

export default CustomButton;
