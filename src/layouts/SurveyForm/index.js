import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SurveyForm = () => {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    phone: "",
    location: "",
    gradeLevel: "",
    stream: "",
    degreeType: "",
    branch: "",
    institution: "",
    graduationYear: "",
    subjects: [],
    studyPreference: "",
    currentPercentage: "",
    currentCGPA: "",
  });

  const [errors, setErrors] = useState({});

  const images = [
    "https://example.com/step3-image.jpg", // Step 3
    "https://img.freepik.com/premium-vector/personal-info-data-user-profile-card-details-symbol-identification-card-personal-info-data-identity-document-with-person-photo-text-clipart-flat-design-vector-illustration_662353-744.jpg", // Step 1
    "https://sea-ac-ae.s3.me-south-1.amazonaws.com/wp-content/uploads/2024/06/19142849/Cover%402x.png", // Step 2
    "https://www.thesouthafrican.com/wp-content/uploads/2022/04/Screenshot_20220425-192643_Samsung-Internet_copy_1200x858_1.jpg.optimal.jpg", // Step 4
    "https://st2.depositphotos.com/2001403/11315/i/450/depositphotos_113159158-laptop-and-stack-of-books.jpg", // Step 5
    "https://www.acspri.org.au/sites/acspri.org.au/files/Online%20survey.jpg",
  ];

  // Fetch logged-in user's ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setFormData((prev) => ({ ...prev, name: user.displayName || "", email: user.email }));
      } else {
        navigate("/signup"); // Redirect if no user is logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, multiple, options } = e.target;
    console.log(formData.subjects);
    if (type === "select-multiple") {
      const values = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setFormData((prevData) => ({ ...prevData, [name]: values }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  if (window.opener) {
    window.close();
  }
  const validateFields = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.age) newErrors.age = "Age is required.";
      if (!formData.bio) newErrors.bio = "Bio is required.";
      if (!formData.phone) newErrors.phone = "Phone No. is required.";
      if (!formData.phone) {
        newErrors.phone = "Phone No. is required.";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone No. must be a 10-digit number.";
      }
      if (!formData.location) newErrors.location = "Location is required.";
    }
    if (step === 2) {
      if (!formData.gradeLevel) newErrors.gradeLevel = "Grade Level is required.";
      if (
        (formData.gradeLevel === "1-10" || formData.gradeLevel === "PU/11-12th") &&
        !formData.currentPercentage
      ) {
        newErrors.currentPercentage = "Percentage is required.";
      } else if (
        formData.currentPercentage &&
        (!/^\d+(\.\d{1,2})?$/.test(formData.currentPercentage) ||
          formData.currentPercentage < 0 ||
          formData.currentPercentage > 100)
      ) {
        newErrors.currentPercentage = "Enter a valid percentage (0-100).";
      }

      if (formData.gradeLevel === "PU/11-12th" && !formData.stream) {
        newErrors.stream = "Stream is required.";
      }

      if (formData.gradeLevel === "Undergraduate") {
        if (!formData.degreeType) newErrors.degreeType = "Degree Type is required.";
        if (!formData.branch) newErrors.branch = "Branch is required.";
        if (!formData.currentCGPA) newErrors.currentCGPA = "CGPA is required.";
        else if (
          !/^\d+(\.\d{1,2})?$/.test(formData.currentCGPA) ||
          formData.currentCGPA < 0 ||
          formData.currentCGPA > 10
        ) {
          newErrors.currentCGPA = "Enter a valid CGPA (0-10).";
        }
      }
    }

    if (step === 3 && formData.subjects.length === 0) {
      newErrors.subjects = "This field is required.";
    }
    if (step === 4 && !formData.studyPreference)
      newErrors.studyPreference = "Study preference is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateFields()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const submitSurvey = async () => {
    if (!userId) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const userSurveyRef = doc(db, "surveys", userId);
      await setDoc(userSurveyRef, formData);
      alert("Survey submitted successfully!");
      window.location.href = "/dashboard"; // Redirect after submission
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting the form.");
    }
  };
  const renderSubjectOptions = () => {
    const grade = formData.gradeLevel;
    if (grade === "1-10") {
      return [
        "English",
        "Maths",
        "Science",
        "Social Science",
        "Computer Basics",
        "General Knowledge",
      ];
    } else if (grade === "PU/11-12th") {
      return [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Computer Science",
        "Economics",
        "Accountancy",
      ];
    } else if (grade === "Undergraduate") {
      return [
        "Web Development",
        "Python",
        "Machine Learning",
        "Data Structures",
        "AI",
        "Cloud Computing",
        "Cybersecurity",
      ];
    }
    return [];
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-5xl bg-gray-600 shadow-2xl backdrop-blur-lg rounded-xl p-8 text-white">
        {step === 0 ? (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src="https://www.acspri.org.au/sites/acspri.org.au/files/Online%20survey.jpg"
                alt="Survey Introduction"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white-800 mb-6">
                Welcome to the Education & Interest Survey
              </h2>
              <p className="text-white-600 mb-6">
                This survey helps us understand your learning preferences.
              </p>
              <button
                onClick={() => setStep(1)}
                className="bg-yellow-400 text-black p-3 rounded-lg hover:bg-yellow-500 transition"
              >
                Start Survey
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 hidden md:block">
              <img src={images[step]} alt="Survey" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-10">
              <h2 className="text-4xl font-bold text-white-800 mb-6 text-center">
                Education & Interest Survey
              </h2>
              <div className="w-full bg-gray-300 rounded-full h-2 mb-6">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>

              {step === 1 && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.name && <p className="text-red-400">{errors.name}</p>}

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.email && <p className="text-red-400">{errors.email}</p>}

                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.age && <p className="text-red-400">{errors.age}</p>}

                  <input
                    type="text"
                    name="bio"
                    placeholder="Add your bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.bio && <p className="text-red-400">{errors.bio}</p>}

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your Contact Number"
                    value={formData.phone}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                      handleChange({ target: { name: "phone", value: onlyNums } });
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.phone && <p className="text-red-400">{errors.phone}</p>}

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  />
                  {errors.location && <p className="text-red-400">{errors.location}</p>}

                  <button
                    onClick={nextStep}
                    className="w-full bg-yellow-400 text-white p-3 rounded-lg hover:bg-yellow-500 transition"
                  >
                    Next
                  </button>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block font-semibold mb-2">Select Your Grade Level:</label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                  >
                    <option value="">Select</option>
                    <option value="1-10">1-10</option>
                    <option value="PU/11-12th">PU / 11-12th</option>
                    <option value="Undergraduate">Undergraduate</option>
                  </select>
                  {errors.gradeLevel && <p className="text-red-500">{errors.gradeLevel}</p>}

                  {/* Percentage input for 1-10 and PU */}
                  {(formData.gradeLevel === "1-10" || formData.gradeLevel === "PU/11-12th") && (
                    <>
                      <input
                        type="number"
                        name="currentPercentage"
                        placeholder="Enter your current percentage"
                        value={formData.currentPercentage}
                        onChange={handleChange}
                        inputMode="numeric"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                      />
                      {errors.currentPercentage && (
                        <p className="text-red-500">{errors.currentPercentage}</p>
                      )}
                    </>
                  )}

                  {/* Stream dropdown for PU/11-12th */}
                  {formData.gradeLevel === "PU/11-12th" && (
                    <>
                      <select
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                      >
                        <option value="">Select Stream</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                      </select>
                      {errors.stream && <p className="text-red-500">{errors.stream}</p>}
                    </>
                  )}

                  {/* Undergraduate details with dropdowns */}
                  {formData.gradeLevel === "Undergraduate" && (
                    <>
                      <select
                        name="degreeType"
                        value={formData.degreeType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                      >
                        <option value="">Select Degree Type</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="B.Com">B.Com</option>
                        <option value="BA">BA</option>
                        <option value="BCA">BCA</option>
                      </select>
                      {errors.degreeType && <p className="text-red-500">{errors.degreeType}</p>}

                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                      >
                        <option value="">Select Branch</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Civil">Civil</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="History">History</option>
                      </select>
                      {errors.branch && <p className="text-red-500">{errors.branch}</p>}

                      <input
                        type="number"
                        name="currentCGPA"
                        placeholder="Enter your current CGPA"
                        value={formData.currentCGPA}
                        onChange={handleChange}
                        inputMode="numeric"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                      />
                      {errors.currentCGPA && <p className="text-red-500">{errors.currentCGPA}</p>}
                    </>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-yellow-400 text-black p-3 rounded-lg hover:bg-yellow-500 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Select your subjects:
                  </label>
                  {renderSubjectOptions().map((subject) => (
                    <div key={subject} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={subject}
                        name="subjects"
                        value={subject}
                        checked={formData.subjects.includes(subject)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setFormData((prevData) => {
                            const updatedSubjects = checked
                              ? [...prevData.subjects, value]
                              : prevData.subjects.filter((subj) => subj !== value);
                            return { ...prevData, subjects: updatedSubjects };
                          });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={subject} className="text-white">
                        {subject}
                      </label>
                    </div>
                  ))}
                  {errors.subjects && <p className="text-red-400">{errors.subjects}</p>}

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-yellow-400 text-black p-3 rounded-lg hover:bg-yellow-500 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <label className="block font-semibold mb-2">
                    What is your preferred mode of study?
                  </label>
                  <select
                    name="studyPreference"
                    value={formData.studyPreference}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-gray-800"
                  >
                    <option value="">Select</option>
                    <option value="videos">Videos</option>
                    <option value="textbooks">Textbooks</option>
                  </select>
                  {errors.studyPreference && (
                    <p className="text-red-500">{errors.studyPreference}</p>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="bg-gray-500 text-black p-3 rounded-lg hover:bg-gray-600 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-yellow-400 text-black p-3 rounded-lg hover:bg-yellow-500 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-4">Thank You for Your Responses!</h3>
                  <p className="text-white-600 mb-6">
                    We appreciate your time in filling out this survey. Your answers will help us
                    tailor a better learning experience for you.
                  </p>
                  <button
                    onClick={submitSurvey}
                    className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Finish
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;
