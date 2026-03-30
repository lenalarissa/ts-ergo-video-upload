import Link from "@/components/video-upload/Link";
import VideoUpload from "@/components/video-upload/VideoUpload";
import QrCode from "@/components/video-upload/QrCode";
import { useState } from "react";
import VideoTitle from "@/components/video-upload/VideoTitle";

export default function MainContent() {
  const [title, setTitle] = useState<string | null>(null);
  const [appLink, setAppLink] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [mailLink, setMailLink] = useState<string>("");

  return (
    <main className="flex-1 flex flex-col items-center justify-evenly gap-6">
      {title === null ? (
        <VideoTitle setTitle={setTitle} />
      ) : (
        <VideoUpload
          title={title}
          setAppLink={setAppLink}
          setMailLink={setMailLink}
          setVideoId={setVideoId}
          setTitle={setTitle}
        />
      )}
      {videoId !== null && (
        <div className="w-full max-w-lg">
          <Link title={"Link für App:"} link={appLink} />
          <Link title={"Link für Mail:"} link={mailLink} />
          <QrCode url={mailLink} videoId={videoId} />
        </div>
      )}
    </main>
  );
}
