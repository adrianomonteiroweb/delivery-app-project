const path = require('path');

const { allProducts, productById } = require('../services/productsServices');
const { OK } = require('../utils/statusCodes');

const getAllProducts = async(_req, res, next) => {
  try {
    const products = await allProducts();
    
    return res.status(OK).json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await productById(id);

    return res.status(OK).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getImageProductByName = async (req, res, _next) => {
  const { name } = req.params;

  res.sendFile(path.join(__dirname, '../../../public/images', name));
};

module.exports = {
  getAllProducts,
  getProductById,
  getImageProductByName,
}