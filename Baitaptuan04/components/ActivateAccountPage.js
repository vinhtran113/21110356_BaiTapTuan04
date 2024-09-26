import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, View, Alert } from "react-native";
import { BASE_URL } from "../config/config";

export default function ActivateAccountPage({ route, navigation }) {
    const { email } = route.params; // Nhận email từ trang đăng ký
    const [otp, setOtp] = useState("");

    const handleSendOtp = () => {
        if (!email) {
            Alert.alert("Lỗi", "Email không hợp lệ.");
            return;
        }

        fetch(`${BASE_URL}/api/auth/send-otp`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Gửi email để yêu cầu OTP
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Thành công", "OTP đã được gửi tới email của bạn.");
            } else {
                Alert.alert("Thất bại", data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    const handleActivateAccount = () => {
        if (!otp) {
            Alert.alert("Lỗi", "Vui lòng nhập mã OTP.");
            return;
        }

        fetch(`${BASE_URL}/api/auth/activate-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Thành công", "Tài khoản đã được kích hoạt thành công.");
                navigation.replace("Login"); // Quay về trang đăng nhập
            } else {
                Alert.alert("Thất bại", data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nhập mã OTP để kích hoạt tài khoản</Text>
            <TextInput 
                style={styles.input} 
                value={otp} 
                onChangeText={setOtp} 
                keyboardType="numeric"
                placeholder="Nhập mã OTP"
            />
            <Button title="Gửi OTP" onPress={handleSendOtp} />
            <Button title="Kích hoạt tài khoản" onPress={handleActivateAccount} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});
