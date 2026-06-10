import { body } from "express-validator";
import { validationErrorHandler } from "../../../middleware/validation-handler.js";

export const createAnswerValidation = [
  body("questionHash")
    .trim()
    .notEmpty()
    .withMessage("Question hash is required"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Answer content is required")
    .isLength({ min: 10 })
    .withMessage("Answer content must be at least 10 characters"),

  validationErrorHandler,
];
