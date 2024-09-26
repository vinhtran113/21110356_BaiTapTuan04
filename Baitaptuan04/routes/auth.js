const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route đăng ký
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc.' });
    }

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });

        // Tạo mã OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Tạo mã OTP 6 số
        const otpExpiration = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

        newUser.otp = otp;
        newUser.otpExpiration = otpExpiration;
        await newUser.save();

        // Gửi email kích hoạt
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tvih6693@gmail.com',
                pass: 'sssq sgfi oifh kxja',
            },
        });

        const mailOptions = {
            from: 'tvih6693@gmail.com',
            to: email,
            subject: 'Kích hoạt tài khoản',
            text: `Mã OTP kích hoạt tài khoản của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Gửi email kích hoạt thất bại.' });
            } else {
                return res.json({ success: true, message: 'Đăng ký thành công! Mã OTP đã được gửi tới email của bạn.' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});




// Route đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});


const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Route yêu cầu gửi OTP qua email
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        // Tạo mã OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Tạo mã OTP 6 số
        const otpExpiration = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

        // Lưu OTP vào cơ sở dữ liệu cùng với thời gian hết hạn
        try {
            user.otp = otp;
            user.otpExpiration = otpExpiration;
            await user.save();
            console.log("OTP saved to database"); // Log thêm để kiểm tra
        } catch (dbError) {
            console.error('Error saving OTP to database:', dbError);
            return res.status(500).json({ success: false, message: 'Có lỗi khi lưu OTP.' });
        }

        // Cấu hình và gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tvih6693@gmail.com',
                pass: 'sssq sgfi oifh kxja',
            },
        });

        const mailOptions = {
            from: 'tvih6693@gmail.com',
            to: email,
            subject: 'Mã xác nhận quên mật khẩu',
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
        };

        // Gửi email
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ success: false, message: 'Gửi email thất bại.' });
                } else {
                    console.log("Email sent:", info.response); // Log thông tin gửi email
                    return res.json({ success: true, message: 'Mã OTP đã được gửi qua email.' });
                }
            });
        } catch (emailError) {
            console.error('Error in email sending process:', emailError);
            return res.status(500).json({ success: false, message: 'Có lỗi khi gửi email.' });
        }

    } catch (error) {
        console.error('Error in forgot-password route:', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});


// Route xác minh OTP và đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        // Kiểm tra xem OTP có khớp và còn hạn không
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ.' });
        }
        if ( user.otpExpiration < Date.now()){
            return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn.' });
        }

        // Mã OTP hợp lệ, tiến hành đặt lại mật khẩu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;  // Xoá OTP sau khi dùng
        user.otpExpiration = null;  // Xoá thời gian hết hạn OTP
        await user.save();

        res.json({ success: true, message: 'Mật khẩu đã được đặt lại thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});

// Route kích hoạt tài khoản
router.post('/activate-account', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
        }

        // Kiểm tra OTP và thời gian hết hạn
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn.' });
        }

        // Kích hoạt tài khoản
        user.is_activated = 1;
        user.otp = null;  // Xoá OTP sau khi dùng
        user.otpExpiration = null;  // Xoá thời gian hết hạn OTP
        await user.save();

        res.json({ success: true, message: 'Tài khoản đã được kích hoạt thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
});


module.exports = router;
