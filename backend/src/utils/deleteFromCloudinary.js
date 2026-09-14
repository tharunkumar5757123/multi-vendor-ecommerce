const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    type: "upload",
    invalidate: true,
  });

  return result;
};

module.exports = deleteFromCloudinary;