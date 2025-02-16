import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CommentSection from "./components/CommentSection";
import LoginSignup from "./components/LoginSingup";
import YoutubeCard from "./components/YoutubeCard";
import VideoList from "./components/VideoList";


function App() {
  const videoData = {
    thumbnail: "https://i.ytimg.com/vi/cnNMo4u0L4M/hq720.jpg",
    duration: "10:49",
    title: "What ACTUALLY happened with Twitter",
    channel: "Mrwhosetheboss",
    views: "1.2M",
    timeAgo: "1 day ago",
    channelIcon: "https://yt3.ggpht.com/Ikb1C4ih2VMvfjma8OO5b39JnHL2CQcQgksB_I7TM-gGA3ERTY589OeLKCYyRQQO0nkE54-f=s68-c-k-c0x00ffffff-no-rj",
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/comments/:video_id/comments" element={<CommentSection />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/videocard" element={<YoutubeCard video={videoData}></YoutubeCard>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
