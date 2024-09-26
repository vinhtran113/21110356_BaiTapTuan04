const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true, // OTP có thể không tồn tại nếu người dùng chưa kích hoạt chức năng này
    },
    otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true, // OTP expiration cũng có thể không tồn tại nếu chưa gửi OTP
    },
    is_activated: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0, // Mặc định là 0 (chưa kích hoạt)
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: true, // Có thể bỏ trống
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: true, // Có thể bỏ trống
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true, // Có thể bỏ trống
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true, // Có thể bỏ trống
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true, // Có thể bỏ trống
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true, // Có thể bỏ trống
    },
}, {
    tableName: 'users'
});

module.exports = User;
