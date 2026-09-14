const Address = require("../models/Address");


// ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    // If this is the first address,
    // automatically make it default
    const addressCount = await Address.countDocuments({
      user: req.user._id,
    });

    let makeDefault = Boolean(isDefault);

    if (addressCount === 0) {
      makeDefault = true;
    }

    // If making this address default,
    // remove default from other addresses
    if (makeDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const newAddress = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: makeDefault,
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add address",
      error: error.message,
    });
  }
};


// GET MY ADDRESSES
const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};


// GET SINGLE ADDRESS
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};


// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const {
      fullName,
      phone,
      address: addressText,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (fullName !== undefined) {
      address.fullName = fullName;
    }

    if (phone !== undefined) {
      address.phone = phone;
    }

    if (addressText !== undefined) {
      address.address = addressText;
    }

    if (city !== undefined) {
      address.city = city;
    }

    if (state !== undefined) {
      address.state = state;
    }

    if (pincode !== undefined) {
      address.pincode = pincode;
    }

    if (isDefault === true) {
      await Address.updateMany(
        {
          user: req.user._id,
          _id: { $ne: id },
        },
        {
          isDefault: false,
        }
      );

      address.isDefault = true;
    }

    await address.save();

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update address",
      error: error.message,
    });
  }
};


// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await Address.findByIdAndDelete(id);

    // If deleted address was default,
    // make another address default
    if (wasDefault) {
      const nextAddress = await Address.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete address",
      error: error.message,
    });
  }
};


// SET DEFAULT ADDRESS
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await Address.updateMany(
      {
        user: req.user._id,
      },
      {
        isDefault: false,
      }
    );

    address.isDefault = true;

    await address.save();

    res.status(200).json({
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to set default address",
      error: error.message,
    });
  }
};


module.exports = {
  addAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};