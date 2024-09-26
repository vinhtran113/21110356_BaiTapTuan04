import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Alert } from "react-native";
import { BASE_URL } from "../config/config";

export default function ForgotPasswordPage({ navigation }) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email.");
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
                setOtpSent(true);
            } else {
                Alert.alert("Thất bại", data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    const handleResetPassword = () => {
        if (!otp || !newPassword || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        fetch(`${BASE_URL}/api/auth/reset-password`, {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp, newPassword }), // Gửi email, OTP và mật khẩu mới
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi.");
                navigation.navigate("Login");  // Chuyển về trang đăng nhập
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
            <Text style={styles.label}>Nhập email để nhận OTP</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                placeholder="Email của bạn"
            />

            <Text style={styles.label}>Mật khẩu mới</Text>
            <TextInput 
                style={styles.input} 
                value={newPassword} 
                onChangeText={setNewPassword} 
                secureTextEntry
                placeholder="Nhập mật khẩu mới"
            />

            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry
                placeholder="Xác nhận mật khẩu mới"
            />

            <Text style={styles.label}>Nhập mã OTP</Text>
            <View style={styles.otpContainer}>
                <TextInput 
                    style={styles.otpInput} 
                    value={otp} 
                    onChangeText={setOtp} 
                    keyboardType="numeric"
                    placeholder="Nhập mã OTP"
                />
                <Button title="Gửi OTP" onPress={handleSendOtp} />
            </View>

            <Button title="Đặt lại mật khẩu" onPress={handleResetPassword} />  

            <View style={styles.loginContainer}>
                <Text>Đã có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                </TouchableOpacity>
            </View>
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
    otpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    otpInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    loginContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    loginLink: {
        color: "blue",
        marginTop: 5,
    },
});