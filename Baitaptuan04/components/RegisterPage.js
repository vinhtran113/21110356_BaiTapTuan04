import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View } from "react-native";
import { BASE_URL } from "../config/config";

export default function RegisterPage({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp.");
            return;
        }

        fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Đăng ký thành công! Vui lòng kiểm tra email của bạn để nhận mã OTP.");
                navigation.navigate("ActivateAccount", { email }); // Chuyển đến trang kích hoạt với email
            } else {
                alert("Đăng ký thất bại. Vui lòng thử lại.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput 
                style={styles.input} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry
            />

            <Button title="Đăng ký" onPress={handleRegister} />
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
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
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
