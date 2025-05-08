const { AppDataSource } = require("../config/database");
const { Cart, CartItem } = require("../entities");
const AppError = require("../utils/AppError");

// Repositories
const cartRepository = AppDataSource.getRepository(Cart);
const cartItemRepository = AppDataSource.getRepository(CartItem);

// Create a new cart
exports.createCart = async (cartData) => {
  const cart = cartRepository.create(cartData);
  return await cartRepository.save(cart);
};

// Get all carts
exports.getAllCarts = async () => {
  return await cartRepository.find({ relations: ["items"] });
};

// Get cart by ID
exports.getCart = async (id) => {
  const cart = await cartRepository.findOne({
    where: { id },
    relations: ["items"],
  });
  if (!cart) {
    throw new AppError("No cart found with that ID", 404);
  }
  return cart;
};

// Update cart
exports.updateCart = async (id, updateData) => {
  const cart = await cartRepository.findOne({ where: { id } });
  if (!cart) {
    throw new AppError("No cart found with that ID", 404);
  }
  Object.assign(cart, updateData);
  return await cartRepository.save(cart);
};

// Delete cart
exports.deleteCart = async (id) => {
  const result = await cartRepository.delete(id);
  if (result.affected === 0) {
    throw new AppError("No cart found with that ID", 404);
  }
};

// Get cart items
exports.getCartItems = async (cartId) => {
  return await cartItemRepository.find({ where: { cart: { id: cartId } } });
};

// Add item to cart
exports.addCartItem = async (cartId, itemData) => {
  const cart = await cartRepository.findOne({ where: { id: cartId } });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }
  const item = cartItemRepository.create({ ...itemData, cart });
  return await cartItemRepository.save(item);
};

// Update cart item
exports.updateCartItem = async (itemId, updateData) => {
  const item = await cartItemRepository.findOne({ where: { id: itemId } });
  if (!item) {
    throw new AppError("No cart item found with that ID", 404);
  }
  Object.assign(item, updateData);
  return await cartItemRepository.save(item);
};

// Remove item from cart
exports.removeCartItem = async (itemId) => {
  const result = await cartItemRepository.delete(itemId);
  if (result.affected === 0) {
    throw new AppError("No cart item found with that ID", 404);
  }
};

// Get user's cart
exports.getUserCart = async (userId) => {
  const cart = await cartRepository.findOne({
    where: { user: { id: userId } },
    relations: ["items"],
  });
  if (!cart) {
    throw new AppError("No cart found for this user", 404);
  }
  return cart;
};

// Checkout cart
exports.checkoutCart = async (cartId) => {
  const cart = await cartRepository.findOne({
    where: { id: cartId },
    relations: ["items"],
  });
  if (!cart) {
    throw new AppError("No cart found with that ID", 404);
  }

  return { message: "Cart checked out successfully" };
};
