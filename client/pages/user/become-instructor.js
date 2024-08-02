// import { useContext, useState } from "react";
// import { Context } from "../../context";
// import { Button } from "antd";
// import axios from "axios";
// import {
//   SettingOutlined,
//   UserSwitchOutlined,
//   LoadingOutlined,
// } from "@ant-design/icons";
// import { toast } from "react-toastify";
// import UserRoute from "../../components/routes/UserRoute";

// const BecomeInstructor = () => {
//   // state
//   const [loading, setLoading] = useState(false);
//   const {
//     state: { user },
//   } = useContext(Context);

//   const becomeInstructor = () => {
//     // console.log("become instructor");
//     setLoading(true);
//     axios
//       .post("/api/make-instructor")
//       .then((res) => {
//         console.log(res);
//         window.location.href = res.data;
//       })
//       .catch((err) => {
//         console.log(err.response.status);
//         toast("Stripe onboarding failed. Try again.");
//         setLoading(true);
//       });
//   };

//   return (
//     <>
//       <h1 className="jumbotron text-center square">Become Instructor</h1>

//       <div className="container">
//         <div className="row">
//           <div className="col-md-6 offset-md-3 text-center">
//             <div className="pt-4">
//               <UserSwitchOutlined className="display-1 pb-3" />
//               <br />
//               <h2>Setup payout to publish courses on Edemy</h2>
//               <p className="lead text-warning">
//                 Edemy partners with stripe to transfer earnings to your bank
//                 account
//               </p>

//               <Button
//                 className="mb-3"
//                 type="primary"
//                 block
//                 shape="round"
//                 icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
//                 size="large"
//                 onClick={becomeInstructor}
//                 disabled={
//                   (user && user.role && user.role.includes("Instructor")) ||
//                   loading
//                 }
//               >
//                 {loading ? "Processing..." : "Payout Setup"}
//               </Button>

//               <p className="lead">
//                 You will be redirected to stripe to complete onboarding process.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BecomeInstructor;

// import { useContext, useState } from "react";
// import { Context } from "../../context";
// import { Button } from "antd";
// import axios from "axios";
// import {
//   SettingOutlined,
//   UserSwitchOutlined,
//   LoadingOutlined,
// } from "@ant-design/icons";
// import { toast } from "react-toastify";
// import UserRoute from "../../components/routes/UserRoute";

// const BecomeInstructor = () => {
//   // state
//   const [loading, setLoading] = useState(false);
//   const {
//     state: { user },
//   } = useContext(Context);

//   const becomeInstructor = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/api/make-instructor");
//       console.log(data);
//       toast("You are now an instructor!");
//       // Optionally, you can redirect or reload the page to reflect changes
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//       toast("Instructor onboarding failed. Try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <h1 className="jumbotron text-center square">Become Instructor</h1>

//       <div className="container">
//         <div className="row">
//           <div className="col-md-6 offset-md-3 text-center">
//             <div className="pt-4">
//               <UserSwitchOutlined className="display-1 pb-3" />
//               <br />
//               <h2>Start adding courses on MyTeam</h2>

//               <Button
//                 className="mb-3"
//                 type="primary"
//                 block
//                 shape="round"
//                 icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
//                 size="large"
//                 onClick={becomeInstructor}
//                 disabled={
//                   (user && user.role && user.role.includes("Instructor")) ||
//                   loading
//                 }
//               >
//                 {loading ? "Processing..." : "Become Instructor"}
//               </Button>

//               <p className="lead">Click the button to become an instructor.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BecomeInstructor;

import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const router = useRouter();

  const becomeInstructor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/make-instructor");
      // Update context with new role
      dispatch({
        type: "LOGIN",
        payload: { ...user, role: ["Instructor"] },
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({ ...user, role: ["Instructor"] })
      );
      toast("You are now an instructor!");
      router.push("/instructor");
    } catch (err) {
      console.log(err);
      toast("Instructor onboarding failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center square">Become Instructor</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Start adding courses here!!</h2>

              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Become Instructor"}
              </Button>

              <p className="lead">Click the button to become an instructor.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
