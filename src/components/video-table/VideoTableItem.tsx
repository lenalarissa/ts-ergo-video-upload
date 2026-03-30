import type { Video } from "@/types/video.ts";
import { useRef, useState } from "react";
import VideoTableRow from "./VideoTableRow";

type VideoTableItemProps = {
  video: Video;
  createMailLink: (id: string) => Promise<string>;
  showNotice: (message: string) => void;
};

export default function VideoTableItem({
  video,
  createMailLink,
  showNotice,
}: VideoTableItemProps) {
  const [mailLink, setMailLink] = useState<string>("");
  const [appLink, setAppLink] = useState<string>("");
  const [qrCodeLink, setQrCodeLink] = useState<string>("");

  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  async function handleLoadMailLink(videoId: string): Promise<void> {
    try {
      const link = await createMailLink(videoId);

      if (!link || link === "") {
        showNotice(
          "Die Mail-Link-Generierung ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
        );
      }

      setMailLink(link);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleGetQRCodeLink(videoId: string): Promise<void> {
    try {
      const link = await createMailLink(videoId);

      if (!link || link === "") {
        showNotice(
          "Die Mail-Link-Generierung für den QR-Code ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
        );
      }

      setQrCodeLink(link);
    } catch (e) {
      console.error(e);
    }
  }

  function createAppLink(videoId: string): void {
    const link = `https://cdn.equeo.de/manifests/${videoId}.m3u8`;
    setAppLink(link);
  }

  return (
    <VideoTableRow
      video={video}
      mailLink={mailLink}
      appLink={appLink}
      qrCodeLink={qrCodeLink}
      qrCodeRef={qrCodeRef}
      handleLoadMailLink={handleLoadMailLink}
      handleGetQRCodeLink={handleGetQRCodeLink}
      createAppLink={createAppLink}
    />
  );
}
