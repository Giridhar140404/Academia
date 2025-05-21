import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig";

const YouTubeTracker = ({ videoId, topic, courseName }) => {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const db = getFirestore();

  useEffect(() => {
    if (window.YT) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    function createPlayer() {
      playerRef.current = new window.YT.Player(`player-${videoId}`, {
        videoId,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        intervalRef.current = setInterval(async () => {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          const progress = (currentTime / duration) * 100;

          const user = auth.currentUser;
          if (user) {
            await setDoc(
              doc(db, "video_progress", `${user.uid}_${videoId}`),
              {
                userId: user.uid,
                courseName,
                topic,
                videoId,
                currentTime,
                duration,
                watchedPercentage: Math.min(progress, 100),
                timestamp: Date.now(),
              },
              { merge: true }
            );
          }
        }, 10000); // Every 10 seconds
      } else {
        clearInterval(intervalRef.current);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [videoId, topic, courseName]);

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <div
        id={`player-${videoId}`}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
};

YouTubeTracker.propTypes = {
  videoId: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
};

export default YouTubeTracker;
