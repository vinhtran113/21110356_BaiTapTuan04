import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
// Import hình ảnh 
import profileImage from "../assets/profile.jpg";

export default function ProfilePage({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login");
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigation]);
    return (
        <View style={styles.container}>
            <Image source={profileImage} style={styles.image} />
            <Text style={styles.textName}>Trần Đức Vinh</Text>
            <Text style={styles.Mssv}>21110356</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 20,
    },
    textName: {
        fontSize: 24,
    },
    textMssv: {
        fontSize: 18,
    }
});
