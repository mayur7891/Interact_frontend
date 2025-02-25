import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import CommentSection from "./components/CommentSection";
import LoginSignup from "./components/LoginSingup";
import YoutubeCard from "./components/YoutubeCard";
import VideoList from "./components/VideoList";
import Tab from "./components/Tab";
import Chatbot from "./components/Chatbot";
import YourReply from "./components/YourReply";
import SentimentChart from "./components/Sentiment";
import Clustered from "./components/Clustered";
import Test from "./components/Test";

import Banner from "./components/HomePage";
import Navbar from "./components/Navbar";
import DisplayVideo from "./components/DisplayVideo";
import CommentTest from "./components/CommentCard";
import TestLogin from "./components/TestLogin";
import About from "./components/About";


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
        <Route path="/login" element={<TestLogin />} />
        <Route path="/about" element={<About />} />
     
        <Route path="/" element={<Banner />} />
        <Route path="/display" element={<DisplayVideo />} />
        <Route path="/commenttest" element={<CommentTest />} />
        <Route path="/videos" element={<VideoList />} />
        {/* <Route path="/test/:video_id" element={<Test />} /> */}
        <Route path="/videocard" element={<YoutubeCard video={videoData}></YoutubeCard>}></Route>
        <Route exact path='/comments/:video_id' element={<Tab/>}>
          <Route index element={<Test/>}></Route>
          <Route exact path="/comments/:video_id/allcomments" element={<Test/>}></Route>
          <Route exact path="/comments/:video_id/clusters" element={<Clustered/>}></Route>
          <Route exact path="/comments/:video_id/chatbot" element={<Chatbot/>}></Route>
          <Route exact path="/comments/:video_id/sentiment" element={<SentimentChart/>}></Route>
          <Route exact path="/comments/:video_id/your_comments" element={<YourReply/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
