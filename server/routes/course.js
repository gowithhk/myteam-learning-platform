import express from "express";
import formidable from "express-formidable";
import { requireSignin } from "../middlewares";
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  getLesson,
  getAllCourses,
} from "../controllers/course";

const router = express.Router();

router.post("/course/upload-image", requireSignin, uploadImage);
router.post("/course/remove-image", requireSignin, removeImage);

router.post("/course", requireSignin, create);
router.get("/course/:slug", read);

router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.get("/course/:slug/lesson/:lessonSlug", requireSignin, getLesson);
router.get("/courses", getAllCourses);

export default router;
