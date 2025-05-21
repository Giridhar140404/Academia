/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Status Badge Component for Reusability
const StatusBadge = ({ status }) => {
  let color = "dark";

  if (status === "Active") color = "success";
  else if (status === "Completed") color = "info";
  else if (status === "Inactive") color = "dark";

  return (
    <MDBox ml={-1}>
      <MDBadge badgeContent={status} color={color} variant="gradient" size="sm" />
    </MDBox>
  );
};

const Subject = ({ name }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDTypography variant="button" fontWeight="medium">
      {name}
    </MDTypography>
  </MDBox>
);

const Category = ({ category }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {category}
    </MDTypography>
  </MDBox>
);

const DifficultyLevel = ({ level }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {level}
    </MDTypography>
  </MDBox>
);

const RedirectToCourse = ({ courseName }) => (
  <MDTypography
    component="a"
    href={`/courses/${courseName?.toLowerCase().replace(/\s+/g, "-")}`}
    variant="caption"
    color="blue"
    fontWeight="medium"
  >
    Go to Course
  </MDTypography>
);

export default function data() {
  return {
    columns: [
      { Header: "Subject", accessor: "subject", width: "45%", align: "left" },
      { Header: "Category", accessor: "category", align: "left" },
      { Header: "Difficulty Level", accessor: "difficultyLevel", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Course Link", accessor: "courseLink", align: "center" },
    ],

    rows: [
      {
        subject: <Subject name="Web Development" />,
        category: <Category category="Programming" />,
        difficultyLevel: <DifficultyLevel level="Medium" />,
        status: <StatusBadge status="Inactive" />,
        courseLink: <RedirectToCourse courseName="Web Development" />,
      },
      {
        subject: <Subject name="Python" />,
        category: <Category category="Programming" />,
        difficultyLevel: <DifficultyLevel level="Easy" />,
        status: <StatusBadge status="Active" />,
        courseLink: <RedirectToCourse courseName="Python" />,
      },
      {
        subject: <Subject name="Graphic Design" />,
        category: <Category category="Design" />,
        difficultyLevel: <DifficultyLevel level="Hard" />,
        status: <StatusBadge status="Completed" />,
        courseLink: <RedirectToCourse courseName="graphic-design" />,
      },
      {
        subject: <Subject name="Data Science" />,
        category: <Category category="Programming" />,
        difficultyLevel: <DifficultyLevel level="Hard" />,
        status: <StatusBadge status="Active" />,
        courseLink: <RedirectToCourse courseName="data-science" />,
      },
      {
        subject: <Subject name="UI/UX Design" />,
        category: <Category category="Design" />,
        difficultyLevel: <DifficultyLevel level="Medium" />,
        status: <StatusBadge status="Inactive" />,
        courseLink: <RedirectToCourse courseName="ui-ux-design" />,
      },
    ],
  };
}
