const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (
  filePath,
  folder = "multi-vendor-ecommerce/products"
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

module.exports = uploadToCloudinary;