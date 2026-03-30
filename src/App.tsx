import Header from "@/components/layout/Header.tsx";
import SignIn from "@/components/sign-in/SignIn.tsx";
import Footer from "@/components/layout/Footer.tsx";
import MainContent from "@/components/layout/MainContent.tsx";
import { Route, Routes } from "react-router-dom";
import VideoTable from "@/components/video-table/VideoTable.tsx";
import useAuth from "@/auth/useAuth.ts";

function App() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-4 min-h-screen bg-white">
      <Header />

      {user !== null ? (
        <Routes>
          <Route path="/upload" element={<MainContent />} />

          <Route path="/videotable" element={<VideoTable />} />

          <Route path="*" element={<MainContent />} />
        </Routes>
      ) : (
        <SignIn />
      )}

      <Footer />
    </div>
  );
}

export default App;
