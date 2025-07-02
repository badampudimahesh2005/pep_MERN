const {USER_ROLES} = require("../constants/userConstants");

const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {send} = require("../service/emailService");

const generateRandomPassword = () => {

    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

const createUser = async (req, res) => {
    try {
        const {username, email, role} = req.body;

        if (!username || !email || !role) {
            return res.status(400).json({
                message: 'Username, email and role are required',
            });
        }

        if (!USER_ROLES.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role',
            });
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists',
            });
        }

        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            adminId: req.user.id,
        });

        await user.save();

        // Send welcome email
        try{
            await send(email, 'Welcome to PEP', `Your account has been created. Your password is: ${password}`);
        } catch (error) {
            console.error('User is created but email not sent, the password is:', password);
        }
      
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find({adminId: req.user.id}).sort({createdAt: -1});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'User ID is required',
            });
        }
        
        const {username, role} = req.body;
        if(role && !USER_ROLES.includes(role)){
            return res.status(400).json({
                message: 'Invalid role',
            });
        }

        const user = await User.findOne({_id:id, adminId: req.user.id});
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (username) {
            user.username = username;
        }
        if (role) {
            user.role = role;
        }
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'User ID is required',
            });
        }

        const user = await User.findOneAndDelete({_id: id, adminId: req.user.id});
        if (!user){
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    generateRandomPassword,
};