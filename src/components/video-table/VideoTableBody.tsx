import type { Video } from "@/types/video";
import VideoTableRow from "./VideoTableRow";

type VideoTableBodyProps = {
  videos: Video[];
  showNotice: (message: string) => void;
};

export default function VideoTableBody({
  videos,
  showNotice,
}: VideoTableBodyProps) {
  return (
    <tbody className="bg-neutral-primary border-b border-default">
      {videos.map((video) => (
        <VideoTableRow key={video.id} video={video} showNotice={showNotice} />
      ))}
    </tbody>
  );
}
