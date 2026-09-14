const getMyProfile = async (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
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
  getAdminData,
  getSellerData,
};