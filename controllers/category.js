const categoryModel = require('../model/category');
const CategoryService = require('../services/category');
let categoryService = new CategoryService();

const createCategory = async (req, res) => {
  const category = req.body;
  try {
    await categoryService.createCategory(category);
    res
      .status(200)
      .json({ status: true, message: 'category created successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = req.params;
    const categoryName = '/' + category.parent;
    let subCategories = await categoryService.getCategory(categoryName);
    if (subCategories.length === 0) {
      return res.status(404).json({
        status: false,
        message: `no category with name: ${category.parent}`
      });
    }
    res.status(200).json({ status: true, subCategoryNames: subCategories });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const { name: updatedName, parent, category } = req.body;
    const updatedCategory = await categoryService.updateCategory(
      { name: name },
      parent,
      category,
      updatedName
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ status: false, message: `no category with name: ${name}` });
    }
    res
      .status(200)
      .json({ status: true, message: 'category updated successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { name: name } = req.params;
    const deletedCategory = await categoryService.deleteCategory({
      name: name
    });
    res
      .status(200)
      .json({ status: true, message: 'category deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory
};
