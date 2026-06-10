import { StatusCodes } from "http-status-codes";
import { createAnswerService } from "../service/answer.service.js";

export const createAnswerController = async (req, res, next) => {
  try {
    const answer = await createAnswerService({
      userId: req.user.id,
      questionHash: req.body.questionHash,
      content: req.body.content,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Answer posted successfully.",
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};
