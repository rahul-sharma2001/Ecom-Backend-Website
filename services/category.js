const categoryModel = require('../model/category');

class CategoryService {
  async createCategory(categoryInfo) {
    try {
      if (!categoryInfo) {
        throw new Error('category details is required');
      }
      const savedCategory = await categoryModel.create(categoryInfo);
      return savedCategory;
    } catch (error) {
      throw error;
    }
  }
  async getCategory(categoryName) {
    try {
      if (!categoryName) {
        throw new Error('category details is required');
      }
      if (
        categoryName === '/men' ||
        categoryName === '/women' ||
        categoryName === '/kids'
      ) {
        const subCategories = await categoryModel.find({
          parent: categoryName
        });
        return subCategories;
      } else {
        const subCategories = await categoryModel.find({
          parent: { $regex: categoryName }
        });
        return subCategories;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(name, parent, category, updatedName) {
    try {
      if (!name) {
        throw new Error('category name is required');
      }
      const updatedCategory = await categoryModel.findOneAndUpdate(name, {
        $set: {
          name: updatedName,
          parent: parent,
          category: category
        }
      });
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(name) {
    try {
      if (!name) {
        throw new Error('category details is required');
      }
      const deletedCategory = await categoryModel.findOneAndDelete(name);
      const categoryName = name.name;
      if (!deletedCategory) {
        throw new Error(`category: ${categoryName} doesn't exists`);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
