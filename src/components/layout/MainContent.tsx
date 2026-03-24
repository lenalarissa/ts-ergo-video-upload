import Link from "@/components/video-upload/Link";
import VideoUpload from "@/components/video-upload/VideoUpload";
import QrCode from "@/components/video-upload/QrCode";
import { useState } from "react";
import VideoTitle from "@/components/video-upload/VideoTitle";

type MainContentProps = {
  mailLink: string;
  pollForMailLink: (id: string) => Promise<string>;
};

export default function MainContent({
  mailLink,
  pollForMailLink,
}: MainContentProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [appLink, setAppLink] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-evenly gap-6">
      {title === null ? (
        <VideoTitle setTitle={setTitle} />
      ) : (
        <VideoUpload
          title={title}
          setAppLink={setAppLink}
          pollForMailLink={pollForMailLink}
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
