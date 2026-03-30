import type { Video } from "@/types/video";
import VideoTableItem from "./VideoTableItem";

type VideoTableBodyProps = {
  videos: Video[];
  createMailLink: (id: string) => Promise<string>;
  showNotice: (message: string) => void;
};

export default function VideoTableBody({
  videos,
  createMailLink,
  showNotice,
}: VideoTableBodyProps) {
  return (
    <tbody className="bg-neutral-primary border-b border-default">
      {videos.map((video) => (
        <VideoTableItem
          video={video}
          createMailLink={createMailLink}
          showNotice={showNotice}
        />
      ))}
    </tbody>
  );
}
