const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get logged-in user's profile
const getMyProfile = async (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};

// Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name.trim();

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Failed to change password",
    });
  }
};

const getAdminData = async (req, res) => {
  res.status(200).json({
    message: "Welcome Admin",
    user: req.user,
  });
};

const getSellerData = async (req, res) => {
  res.status(200).json({
    message: "Welcome Seller",
    user: req.user,
  });
};

module.exports = {
  getMyProfile,
  updateProfile,
  changePassword,
  getAdminData,
  getSellerData,
};