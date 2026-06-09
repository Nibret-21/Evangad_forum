import express from "express";
import { authenticateUser } from "../../../middleware/authentication.js";

import {
  createQuestionController,
  getQuestionsController,
  searchQuestionsSemanticController,
  generateQuestionDraftCoachController,
  getSimilarQuestionsController,
  assessAnswerAgainstQuestionController,
  getSingleQuestionController,
} from "../controller/question.controller.js";

import {
  createQuestionValidation,
  getQuestionsValidation,
  searchQuestionsSemanticValidation,
  generateQuestionDraftCoachValidation,
  getSimilarQuestionsValidation,
  assessAnswerAgainstQuestionValidation,
  getSingleQuestionValidation,
} from "../validation/question.validation.js";

//create router
const router = express.Router();

router.post(
  "/",
  authenticateUser,
  createQuestionValidation,
  createQuestionController,
);
//get all questions with optional search and mine filter for fetching only the authenticated user's questions.
/**
 * @route GET /api/questions
 * @desc Get all questions with optional search/mine filter
 * @access Protected
 */ 
router.get(
  "/",
  authenticateUser,
  getQuestionsValidation,
  getQuestionsController,
);

router.get(
  "/search",
  authenticateUser,
  searchQuestionsSemanticValidation,
  searchQuestionsSemanticController,
);

router.post(
  "/draft-coach",
  authenticateUser,
  generateQuestionDraftCoachValidation,
  generateQuestionDraftCoachController,
);

router.get(
  "/:questionHash/similar",
  authenticateUser,
  getSimilarQuestionsValidation,
  getSimilarQuestionsController,
);

router.post(
  "/:questionHash/answer-fit",
  authenticateUser,
  assessAnswerAgainstQuestionValidation,
  assessAnswerAgainstQuestionController,
);

router.get(
  "/:questionHash",
  authenticateUser,
  getSingleQuestionValidation,
  getSingleQuestionController,
);

export default router;




