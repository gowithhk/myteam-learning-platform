import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from "../models/course";
import slugify from "slugify";
import { readFileSync } from "fs";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: "latest",
};

const S3 = new AWS.S3(awsConfig);

// export const uploadImage = async (req, res) => {
//   try {
//     const { image } = req.body;
//     if (!image) return res.status(400).send("No image");

//     const base64Data = new Buffer.from(
//       image.replace(/^data:image\/\w+;base64,/, ""),
//       "base64"
//     );

//     const type = image.split(";")[0].split("/")[1];

//     const params = {
//       Bucket: "myteam-bucket",
//       Key: `${nanoid()}.${type}`,
//       Body: base64Data,
//       ACL: "public-read",
//       ContentEncoding: "base64",
//       ContentType: `image/${type}`,
//     };

//     S3.upload(params, (err, data) => {
//       if (err) {
//         console.log(err);
//         return res.sendStatus(400);
//       }
//       console.log(data);
//       res.send(data);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const uploadImage = async (req, res) => {
  try {
    console.log("Received image upload request:", req.body);
    const { image } = req.body;
    if (!image) {
      console.log("No image provided");
      return res.status(400).send("No image");
    }

    const base64Data = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];

    const params = {
      Bucket: "myteam-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      // ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    console.log("Uploading to S3 with params:", params);

    S3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        return res.sendStatus(400);
      }
      console.log("Image uploaded successfully:", data);
      res.send(data);
    });
  } catch (err) {
    console.error("Error in uploadImage controller:", err);
  }
};

// export const uploadImage = async (req, res) => {
//   try {
//     console.log("Received image upload request:", req.files);
//     const { image } = req.files;
//     if (!image) {
//       console.log("No image provided");
//       return res.status(400).send("No image");
//     }

//     const base64Data = readFileSync(image.path);
//     const type = image.type.split("/")[1];

//     const params = {
//       Bucket: "myteam-bucket",
//       Key: `${nanoid()}.${type}`,
//       Body: base64Data,
//       // ACL: "public-read",
//       ContentType: image.type,
//     };

//     console.log("Uploading to S3 with params:", params);

//     S3.upload(params, (err, data) => {
//       if (err) {
//         console.error("Error uploading to S3:", err);
//         return res.sendStatus(400);
//       }
//       console.log("Image uploaded successfully:", data);
//       res.send(data);
//     });
//   } catch (err) {
//     console.error("Error in uploadImage controller:", err);
//   }
// };

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;

    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

// export const create = async (req, res) => {
//   try {
//     const alreadyExist = await Course.findOne({
//       slug: slugify(req.body.name.toLowerCase()),
//     });
//     if (alreadyExist) return res.status(400).send("Title is taken");

//     const course = await new Course({
//       slug: slugify(req.body.name),
//       instructor: req.user._id,
//       ...req.body,
//     }).save();

//     res.json(course);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Course create failed. Try again.");
//   }
// };


export const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Course name is required");
    }

    const alreadyExist = await Course.findOne({
      slug: slugify(name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(name),
      instructor: req.user._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course creation failed. Try again.");
  }
};

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    if (req.user._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const { video } = req.files;
    if (!video) return res.status(400).send("No video");

    const params = {
      Bucket: "myteam-bucket",
      Key: `${nanoid()}.${video.type.split("/")[1]}`,
      Body: readFileSync(video.path),
      ContentType: video.type,
    };

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    if (req.user._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const { Bucket, Key } = req.body;

    const params = {
      Bucket,
      Key,
    };

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

// export const addLesson = async (req, res) => {
//   try {
//     const { slug, instructorId } = req.params;
//     const { title, content, video } = req.body;

//     if (req.user._id != instructorId) {
//       return res.status(400).send("Unauthorized");
//     }

//     const updated = await Course.findOneAndUpdate(
//       { slug },
//       {
//         $push: { lessons: { title, content, video, slug: slugify(title) } },
//       },
//       { new: true }
//     )
//       .populate("instructor", "_id name")
//       .exec();
//     res.json(updated);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Add lesson failed");
//   }
// };

export const addLesson = async (req, res) => {
  try {
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;

    if (req.user._id != instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          lessons: {
            title,
            content,
            video,
            slug: slugify(title),
          },
        },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

export const getLesson = async (req, res) => {
  try {
    const { slug, lessonSlug } = req.params;
    const course = await Course.findOne({ slug }).exec();
    if (!course) return res.status(404).send("Course not found");

    const lesson = course.lessons.find((lesson) => lesson.slug === lessonSlug);
    if (!lesson) return res.status(404).send("Lesson not found");

    res.json(lesson);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error retrieving lesson");
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor", "_id name")
      .populate("lessons")
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error retrieving courses");
  }
};
