import Product from "../models/product/product.model";
import validate from "./validate.middleware"
import { body, query } from "express-validator";

export const postProductReviewValidator = validate([
    body('product').exists().notEmpty().withMessage('Product is required').isMongoId().withMessage('Invalid product').custom(async value => {
        const existingProduct = await Product.findById
            (value);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        return true
    }),
    body('rating').exists().notEmpty().withMessage('Rating is required').isNumeric().withMessage('Rating must be a number').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').exists().notEmpty().withMessage('Review is required'),
])

export const deleteProductReviewValidator = validate([
    query('_id').exists().notEmpty().withMessage('_id is required').isMongoId().withMessage('Invalid _id'),
])
