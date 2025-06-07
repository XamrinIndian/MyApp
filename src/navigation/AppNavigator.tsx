import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux"; 
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebase";  
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";
import type { RootState, AppDispatch } from "../store";
import CreatePostScreen from "../screens/CreatePostScreen";
import { setUser, clearUser } from "../store/authSlice"; 
import UpdateProfileScreen from "../screens/UpdateProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("firebaseUser=>>", firebaseUser);
  
      if (firebaseUser) {
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: ''
        }));
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [dispatch]);
  
  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="CreatePostScreen"
              component={CreatePostScreen}
              options={{ presentation: "modal" }}
            />
             <Stack.Screen
              name="UpdateProfileScreen"
              component={UpdateProfileScreen}
              options={{ presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
