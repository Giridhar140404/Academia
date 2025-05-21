// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import LandingPage from "layouts/landing/landingPage";
import Survey from "layouts/SurveyForm/index";
import CoursePage from "layouts/Courses";
import QuizPage from "quizzes/QuizPage";
import AlreadyLoggedInRoute from "AlreadyLoggedInRoute";
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Courses",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Landing",
    key: "landing",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/",
    component: <LandingPage />,
  },
];

const authRoutes = [
  {
    route: "/authentication/sign-in",
    component: (
      <AlreadyLoggedInRoute>
        <SignIn />
      </AlreadyLoggedInRoute>
    ),
  },
  {
    route: "/authentication/sign-up",
    component: (
      <AlreadyLoggedInRoute>
        <SignUp />
      </AlreadyLoggedInRoute>
    ),
  },
];

const surveyRoute = [
  {
    route: "/survey",
    component: <Survey />,
  },
];

const courseRoute = [
  {
    route: "/courses/:courseName",
    component: <CoursePage />,
  },
];

const quizzes = [
  {
    route: "/quiz/:courseName/:quizId",
    component: <QuizPage />,
  },
];
export { routes, authRoutes, surveyRoute, courseRoute, quizzes };
