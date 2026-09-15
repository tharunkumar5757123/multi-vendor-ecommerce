
const Product = require("../models/Product");
const Category = require("../models/Category");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const generateSlug = require("../utils/generateSlug");

const fs = require("fs");

// ======================================================
// Create Product
// Seller / Admin
// ======================================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      stock,
      sku,
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined ||
      !sku
    ) {
      return res.status(400).json({
        message: "Please provide all required product fields",
      });
    }

    // Check active category
    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Active category not found",
      });
    }

    // Check SKU
    const existingProduct = await Product.findOne({
      sku: sku.trim(),
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }

    // Generate unique slug
    let slug = generateSlug(name);

    const existingSlug = await Product.findOne({ slug });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Upload images
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        console.log("Local file:", file.path);

        const result = await uploadToCloudinary(file.path);

        images.push({
          url: result.url,
          publicId: result.publicId,
        });

        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      price: Number(price),
      discountPrice:
        discountPrice !== undefined
          ? Number(discountPrice)
          : 0,
      images,
      brand: brand ? brand.trim() : "",
      category,
      seller: req.user._id,
      stock: Number(stock),
      sku: sku.trim(),
    });

    await product.populate([
      {
        path: "category",
        select: "name",
      },
      {
        path: "seller",
        select: "name email",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ======================================================
// Get All Active Products
// Customer
// ======================================================

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * perPage;

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "priceLow") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "priceHigh") {
      sortOption = {
        price: -1,
      };
    }

    if (sort === "rating") {
      sortOption = {
        rating: -1,
      };
    }

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    const totalProducts =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage,
        totalPages: Math.ceil(
          totalProducts / perPage
        ),
        totalProducts,
        perPage,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ======================================================
// Admin - Get All Products
// Active + Inactive
// ======================================================

const getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Admin get products error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch admin products",
      error: error.message,
    });
  }
};

// ======================================================
// Seller - Get My Products
// ======================================================

const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    })
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Seller get products error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};

// ======================================================
// Get Single Product
// ======================================================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get single product error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ======================================================
// Update Product
// Seller / Admin
// ======================================================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller can update only own products
    if (
      req.user.role === "seller" &&
      product.seller.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can update only your own products",
      });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      stock,
      sku,
      existingImages,
    } = req.body;

    // Check category
    if (category) {
      const categoryExists =
        await Category.findOne({
          _id: category,
          isActive: true,
        });

      if (!categoryExists) {
        return res.status(404).json({
          message: "Active category not found",
        });
      }
    }

    // Check SKU
    if (sku && sku.trim() !== product.sku) {
      const existingSku =
        await Product.findOne({
          sku: sku.trim(),
          _id: {
            $ne: product._id,
          },
        });

      if (existingSku) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    // Existing images
    let keptImages = [];

    if (existingImages) {
      try {
        keptImages =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;

        if (!Array.isArray(keptImages)) {
          return res.status(400).json({
            message:
              "existingImages must be an array",
          });
        }
      } catch (error) {
        return res.status(400).json({
          message:
            "Invalid existingImages format",
        });
      }
    } else {
      // Keep all existing images
      keptImages = product.images || [];
    }

    // Old images
    const oldImages = product.images || [];

    // Find removed images
    const imagesToDelete = oldImages.filter(
      (oldImage) =>
        !keptImages.some(
          (keptImage) =>
            keptImage.publicId ===
            oldImage.publicId
        )
    );

    // Delete removed images from Cloudinary
    for (const image of imagesToDelete) {
      if (image.publicId) {
        await deleteFromCloudinary(
          image.publicId
        );
      }
    }

    // Upload new images
    const newImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result =
          await uploadToCloudinary(
            file.path
          );

        newImages.push({
          url: result.url,
          publicId: result.publicId,
        });

        if (
          file.path &&
          fs.existsSync(file.path)
        ) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // Check if name changed
    const nameChanged =
      name !== undefined &&
      name.trim() !== product.name;

    // Update fields
    product.name =
      name !== undefined
        ? name.trim()
        : product.name;

    product.description =
      description !== undefined
        ? description.trim()
        : product.description;

    product.price =
      price !== undefined
        ? Number(price)
        : product.price;

    product.discountPrice =
      discountPrice !== undefined
        ? Number(discountPrice)
        : product.discountPrice;

    product.brand =
      brand !== undefined
        ? brand.trim()
        : product.brand;

    product.category =
      category ?? product.category;

    product.stock =
      stock !== undefined
        ? Number(stock)
        : product.stock;

    product.sku =
      sku !== undefined
        ? sku.trim()
        : product.sku;

    // Update slug if name changed
    if (nameChanged) {
      let newSlug = generateSlug(name);

      const existingSlug =
        await Product.findOne({
          slug: newSlug,
          _id: {
            $ne: product._id,
          },
        });

      if (existingSlug) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      product.slug = newSlug;
    }

    // Update images
    product.images = [
      ...keptImages,
      ...newImages,
    ];

    await product.save();

    // Populate
    await product.populate([
      {
        path: "category",
        select: "name",
      },
      {
        path: "seller",
        select: "name email",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ======================================================
// Admin - Activate / Deactivate Product
// ======================================================

const updateProductStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false",
      });
    }

    const product =
      await Product.findByIdAndUpdate(
        id,
        {
          isActive,
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      )
        .populate("category", "name")
        .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${
        isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      product,
    });
  } catch (error) {
    console.error(
      "Update product status error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update product status",
      error: error.message,
    });
  }
};

// ======================================================
// Delete Product
// Seller / Admin
// ======================================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller can delete only own products
    if (
      req.user.role === "seller" &&
      product.seller.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can delete only your own products",
      });
    }

    // Delete images from Cloudinary
    if (
      product.images &&
      product.images.length > 0
    ) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteFromCloudinary(
            image.publicId
          );
        }
      }
    }

    // Delete product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ======================================================
// Export Controllers
// ======================================================

module.exports = {
  createProduct,
  getProducts,
  getAllProductsForAdmin,
  getSellerProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
