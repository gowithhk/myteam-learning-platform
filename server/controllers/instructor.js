import User from "../models/user";
import Course from "../models/course";

export const makeInstructor = async (req, res) => {
  try {
    // 1. find user from db
    const user = await User.findById(req.user._id).exec();
    // 2. update user's role to "Instructor"
    user.role = [...new Set([...user.role, "Instructor"])];
    await user.save();
    // 3. send response
    res.json({ message: "You are now an instructor" });
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR ", err);
    res.status(500).send("Internal Server Error");
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    // Assuming account status check logic is now only based on user role
    if (!user.role.includes("Instructor")) {
      return res.status(401).send("Unauthorized");
    } else {
      res.json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    // Check if user is an instructor
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
