import express from "express";
import authRoutes from "./auth/routes/auth.routes.js";
import questionsRoutes from "./question/routes/question.routes.js";
import answersRoutes from "./answer/routes/answer.routes.js";
const mainRouter = express.Router();
//api/auth
mainRouter.use("/auth", authRoutes);
//api/questions
mainRouter.use("/questions", questionsRoutes);

console.log("Answers route loaded");
//api/answers
mainRouter.use("/answers", answersRoutes);

export default mainRouter;
