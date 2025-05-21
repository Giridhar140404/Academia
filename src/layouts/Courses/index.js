import React, { useEffect, useState } from "react";
import YouTubeTracker from "./youtubeTracker";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Grid,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";

const roadmapTopicsMap = {
  "Computer Networks": [
    "CN_Introduction",
    "CN_Network Topologies & Types",
    "CN_Network Devices",
    "CN_IP Addressing and Subnetting",
    "CN_ Network Protocols",
    "CN_OSI and TCP/IP Models",
    "CN_IP Addressing and Subnetting",
    "CN_Transmission Media",
    "CN_Data Transmission Modes & Switching",
    "CN_MAC Address & ARP",
  ],
  Python: [
    "Python Basics",
    "Data Structures",
    "OOP in Python",
    "Libraries (NumPy, Pandas)",
    "Python Interview Prep",
  ],
  Java: [
    "java_Introduction",
    "java_Variables and Data Types",
    "java_operators & control_statement",
    "java_Loops",
    "java_input/output",
  ],
  "Operating Systems": [
    "OS_Introduction",
    "OS_Process Management",
    "OS_Threads and Multithreading",
    "OS_CPU Scheduling Algorithms",
    "OS_Memory management",
    "OS_Input/Output Systems",
    "OS_Security and Protection",
  ],
  Aptitude: [
    "apt_age",
    "apt_averages",
    "apt_Time Speed and Distance",
    "apt_Time and Work",
    "apt_Ratio and Proportion",
    "apt_Simple and Compound Interest",
    "apt_Profit and Loss",
    "apt_Percentages",
    "apt_Number System",
  ],
};

export default function CoursePage() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const roadmapTopics = roadmapTopicsMap[courseName] || [];
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);

  const YOUTUBE_API_KEY = "AIzaSyCDrKBn1-5js9VtnJZsL8ZljNO2aTKVH7o";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = {};

        for (const topic of roadmapTopics) {
          const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
              part: "snippet",
              q: `${topic} ${courseName} tutorial`,
              key: YOUTUBE_API_KEY,
              type: "video",
              maxResults: 4,
            },
          });
          videoData[topic] = res.data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
          }));
        }
        setVideos(videoData);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roadmapTopics.length) fetchVideos();
    else setLoading(false);
  }, [courseName]);

  if (!roadmapTopics.length) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No roadmap found for &quot;{courseName}&quot;
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* Sticky Header */}
      <AppBar position="sticky" color="default" elevation={2} sx={{ mb: 3, py: 1 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            Back to Dashboard
          </Button>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            sx={{ fontWeight: "900", letterSpacing: 1 }}
          >
            {courseName} Roadmap
          </Typography>
          <Box sx={{ width: 120 }} /> {/* spacer to balance layout */}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pb: 6,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 10,
            }}
          >
            <CircularProgress size={64} />
          </Box>
        ) : (
          roadmapTopics.map((topic) => (
            <Box key={topic} sx={{ mb: 8 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "secondary.main",
                  letterSpacing: 0.5,
                }}
              >
                {topic}
              </Typography>

              <Grid container spacing={3}>
                {videos[topic]?.length ? (
                  videos[topic].map(({ id, title, thumbnail }) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={id} sx={{ display: "flex" }}>
                      <Card
                        sx={{
                          width: "100%",
                          borderRadius: 3,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.12), 0 6px 10px rgba(0,0,0,0.06)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ mt: 1 }}>
                            <YouTubeTracker videoId={id} topic={topic} courseName={courseName} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ p: 3, color: "text.secondary" }} variant="body2">
                    No videos found for this topic.
                  </Typography>
                )}
              </Grid>

              <Divider sx={{ mt: 4, mb: 3 }} />

              <Stack alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/quiz/${courseName}/${encodeURIComponent(topic)}`)}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: "bold",
                    backgroundColor: "#6c63ff",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#574b90" },
                    textTransform: "none",
                    boxShadow: "0 6px 12px rgba(108, 99, 255, 0.5)",
                  }}
                >
                  Take Quiz: {topic}
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
