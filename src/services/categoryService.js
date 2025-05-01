const { AppDataSource } = require("../config/database");
const { Category } = require("../entities");
const AppError = require("../utils/AppError");

class CategoryService {
  constructor() {
    this.repository = AppDataSource.getRepository(Category);
  }

  // Create a new category
  async createCategory(categoryData) {
    try {
      const category = this.repository.create(categoryData);
      return await this.repository.save(category);
    } catch (error) {
      if (error.code === "23505") {
        throw new AppError("Category already exists", 400);
      }
      throw error;
    }
  }

  // Get all categories
  async getAllCategories() {
    return await this.repository.find();
  }

  // Get category by ID
  async getCategoryById(id) {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }

  // Update category
  async updateCategory(id, categoryData) {
    const category = await this.getCategoryById(id);
    Object.assign(category, categoryData);
    return await this.repository.save(category);
  }

  // Delete category
  async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    await this.repository.remove(category);
    return { message: "Category deleted successfully" };
  }
}

module.exports = new CategoryService();
