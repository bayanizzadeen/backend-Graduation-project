const { Order } = require("../entities");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { AppDataSource } = require("../config/database");

const orderRepository = AppDataSource.getRepository(Order);

// إنشاء طلب جديد
exports.createOrder = catchAsync(async (orderData) => {
  const order = orderRepository.create(orderData);
  return await orderRepository.save(order);
});

exports.getAllOrders = async () => {
  return await orderRepository.find({
    relations: ["user", "cart"],
  });
};

// جلب طلب بواسطة المعرف
exports.getOrderById = catchAsync(async (id) => {
  const order = await orderRepository.findOne({
    where: { id },
    relations: ["user", "cart"],
  });

  if (!order) {
    throw new AppError("No order found with that ID", 404);
  }

  return order;
});

// تحديث الطلب
exports.updateOrder = catchAsync(async (id, updateData) => {
  const order = await orderRepository.findOne({
    where: { id },
  });

  if (!order) {
    throw new AppError("No order found with that ID", 404);
  }

  Object.assign(order, updateData);
  return await orderRepository.save(order);
});

// حذف الطلب
exports.deleteOrder = catchAsync(async (id) => {
  const order = await orderRepository.findOne({
    where: { id },
  });

  if (!order) {
    throw new AppError("No order found with that ID", 404);
  }

  await orderRepository.remove(order);
});

// جلب الطلبات بناءً على معرف المستخدم
exports.getOrdersByUser = catchAsync(async (userId) => {
  const orders = await orderRepository.find({
    where: { userId },
    relations: ["user", "cart"],
  });

  return orders; // لا ترمي خطأ
});

// جلب الطلبات بناءً على الحالة
exports.getOrdersByStatus = catchAsync(async (status) => {
  const orders = await orderRepository.find({
    where: { orderStatus: status },
    relations: ["user", "cart"],
  });

  return orders; // لا ترمي خطأ
});

exports.updateOrderStatus = catchAsync(async (id, status) => {
  const order = await orderRepository.findOne({
    where: { id },
  });

  if (!order) {
    throw new AppError("No order found with that ID", 404);
  }

  order.orderStatus = status;
  return await orderRepository.save(order);
});
