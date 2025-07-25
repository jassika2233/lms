import express from 'express'
import {  isAdmin, isAuth } from '../middlewares/isAuth.js';
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRole } from '../controllers/admin.js';
import {uploadFiles} from '../middlewares/multer.js';

const router = express.Router();

router.post("/course/new",isAuth, isAdmin, uploadFiles,createCourse);
router.post("/course/:id",isAuth,isAdmin,uploadFiles,addLectures);
router.delete("/course/:id",isAuth,isAdmin,deleteCourse);
router.delete("/lecture/:id",isAuth,isAdmin,deleteLecture);
router.get("/stats",isAdmin,isAuth,getAllStats);
router.put("/user/:id",isAdmin,isAuth,updateRole)
router.get("/users",isAdmin,isAuth,getAllUser)

export default router;