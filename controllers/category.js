const categoryModel = require('../model/category');
const CategoryService = require('../services/category');
let categoryServiceInstance = new CategoryService();

const createCategory = async (req, res) => {
  const category = req.body;
  try {
    const category_data = await categoryModel.find();
    if (category_data.length > 0) {
      let checking = false;
      for (let i = 0; i < category_data.length; i++) {
        if (
          category_data[i]['name'].toLowerCase() == req.body.name.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
      if (checking == false) {
        await categoryServiceInstance.createCategory(category);
        res
          .status(200)
          .json({ status: true, message: 'category created successfully!' });
      } else {
        res.status(404).json({
          status: false,
          message: `This Category ${category.name} already exists`
        });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = req.params;
    const categoryName = '/' + category.parent;
    let subCategories = await categoryServiceInstance.getCategory(categoryName);
    if (subCategories.length === 0) {
      return res.status(404).json({
        status: false,
        message: `no category with name: ${category.parent}`
      });
    }
    let subCategoryNames = subCategories.map(({ name }) => name);
    res.status(200).json({ status: true, subCategoryNames });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const { name: updatedName, parent, category } = req.body;
    const updatedCategory = await categoryServiceInstance.updateCategory(
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
    const deletedCategory = await categoryServiceInstance.deleteCategory({
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
