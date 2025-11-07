import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import nodemailer from 'nodemailer';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Generate random password
const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Configure nodemailer transporter
const createTransporter = () => {
    // You can configure this with your email service (Gmail, SendGrid, etc.)
    // For now, using a basic SMTP configuration
    // You'll need to set these in your .env file:
    // EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// Send email with password
const sendPasswordEmail = async (email, name, password) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@thetee.com',
            to: email,
            subject: 'Welcome to The Tee - Your Account Details',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Welcome to The Tee!</h2>
                    <p>Hello ${name},</p>
                    <p>Your account has been created successfully. Here are your login credentials:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>Please keep this password safe. You can change it later from your account settings.</p>
                    <p>Thank you for shopping with us!</p>
                    <p>Best regards,<br>The Tee Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email,password} = req.body
        // Debug logs to help diagnose credential issues
 if (email === 'thetee545@gmail.com' && password === 'Thetee@123#'){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Guest checkout - create account with email, auto-login, send password email
const guestCheckout = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (!name || name.trim().length === 0) {
            return res.json({ success: false, message: "Please enter your name" })
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });
        let isNewUser = false;
        let autoGeneratedPassword = null;

        if (!user) {
            // Generate auto password
            autoGeneratedPassword = generatePassword();
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(autoGeneratedPassword, salt);

            // Create new user
            user = new userModel({
                name: name.trim(),
                email,
                password: hashedPassword
            });

            await user.save();
            isNewUser = true;

            // Send email with password (don't wait for it to complete)
            sendPasswordEmail(email, name, autoGeneratedPassword).catch(err => {
                console.error('Failed to send email:', err);
                // Don't fail the request if email fails
            });
        }

        // Create token and auto-login
        const token = createToken(user._id);

        res.json({ 
            success: true, 
            token,
            isNewUser,
            message: isNewUser ? "Account created successfully. Password sent to your email." : "Logged in successfully."
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, guestCheckout }