
import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import InstructorNav from "../../components/nav/InstructorNav"; // Import InstructorNav

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data } = await axios.get("/api/instructor-courses");
      setCourses(data);
    } catch (err) {
      console.log(err);
    }
  };

  const myStyle = { marginTop: "-15px", fontSize: "10px" };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <InstructorNav /> {/* Add InstructorNav */}
          </div>
          <div className="col-md-10">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div className="media pt-2" key={course._id}>
                  <Avatar
                    size={80}
                    src={course.image ? course.image.Location : "/course.png"}
                  />
                  <div className="media-body pl-2">
                    <div className="row">
                      <div className="col">
                        <Link href={`/instructor/course/view/${course.slug}`}>
                          <a className="mt-2 text-primary">
                            <h5 className="pt-2">{course.name}</h5>
                          </a>
                        </Link>
                        <p style={{ marginTop: "-10px" }}>
                          {course.lessons.length} Lessons
                        </p>
                        {course.lessons.length < 5 ? (
                          <p style={myStyle} className="text-warning">
                            At least 5 lessons are required to publish a course
                          </p>
                        ) : course.published ? (
                          <p style={myStyle} className="text-success">
                            Your course is live in the marketplace
                          </p>
                        ) : (
                          <p style={myStyle} className="text-success">
                            Your course is ready to be published
                          </p>
                        )}
                      </div>
                      <div className="col-md-3 mt-3 text-center">
                        {course.published ? (
                          <CheckCircleOutlined className="h5 pointer text-success" />
                        ) : (
                          <CloseCircleOutlined className="h5 pointer text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No courses yet</p>
            )}
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorIndex;
