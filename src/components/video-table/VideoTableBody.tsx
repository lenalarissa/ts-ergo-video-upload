import { useRef } from "react";
import type { Video } from "@/types/video";
import VideoTableRow from "./VideoTableRow";

type VideoTableBodyProps = {
  videos: Video[];
  mailLinks: Record<string, string>;
  appLinks: Record<string, string>;
  qrCodeLinks: Record<string, string>;
  handleLoadMailLink: (videoId: string) => Promise<void>;
  handleGetQRCodeLink: (videoId: string) => Promise<void>;
  handleDownloadQRCode: (
    container: HTMLDivElement | null,
    videoId: string,
  ) => void;
  createAppLink: (videoId: string) => void;
};

export default function VideoTableBody({
  videos,
  mailLinks,
  appLinks,
  qrCodeLinks,
  handleLoadMailLink,
  handleGetQRCodeLink,
  handleDownloadQRCode,
  createAppLink,
}: VideoTableBodyProps) {
  const qrCodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  return (
    <tbody className="bg-neutral-primary border-b border-default">
      {videos.map((video) => (
        <VideoTableRow
          key={video.id}
          video={video}
          mailLink={mailLinks?.[video.id]}
          appLink={appLinks?.[video.id]}
          qrCodeLink={qrCodeLinks?.[video.id]}
          handleLoadMailLink={() => handleLoadMailLink(video.id)}
          handleGetQRCodeLink={() => handleGetQRCodeLink(video.id)}
          handleDownloadQRCode={() =>
            handleDownloadQRCode(qrCodeRefs.current[video.id], video.id)
          }
          createAppLink={() => createAppLink(video.id)}
          qrCodeRefs={qrCodeRefs}
        />
      ))}
    </tbody>
  );
}
