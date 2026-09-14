
// Create Product
const Product = require("../models/Product");
const Category = require("../models/Category");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const generateSlug = require("../utils/generateSlug");

const fs = require("fs");

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

    // Validate required fields
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

    // Check category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check SKU
    const existingProduct = await Product.findOne({ sku });

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

        // Delete local file after Cloudinary upload
        fs.unlinkSync(file.path);
      }
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice: discountPrice || 0,
      images,
      brand: brand || "",
      category,
      seller: req.user._id,
      stock,
      sku,
    });

    // Populate category and seller
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

    // Response
    res.status(201).json({
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


// Get All Products
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

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter
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

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      products,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalProducts / perPage),
        totalProducts,
        perPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get Single Product
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
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      req.user.role === "seller" &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can update only your own products",
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

    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    }

    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({
        sku,
        _id: { $ne: product._id },
      });

      if (existingSku) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    let keptImages = [];

    if (existingImages) {
      try {
        keptImages =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
      } catch (error) {
        return res.status(400).json({
          message: "Invalid existingImages format",
        });
      }
    }

    const oldImages = product.images || [];

    const imagesToDelete = oldImages.filter(
      (oldImage) =>
        !keptImages.some(
          (keptImage) => keptImage.publicId === oldImage.publicId
        )
    );

    for (const image of imagesToDelete) {
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    const newImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "multi-vendor-ecommerce/products"
        );

        newImages.push({
          url: result.url,
          publicId: result.publicId,
        });
      }
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice =
      discountPrice !== undefined
        ? discountPrice
        : product.discountPrice;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.sku = sku ?? product.sku;

    product.images = [...keptImages, ...newImages];

    await product.save();

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

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      req.user.role === "seller" &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can delete only your own products",
      });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }
      }
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};