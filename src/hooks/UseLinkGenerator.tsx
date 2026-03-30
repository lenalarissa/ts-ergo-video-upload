import { useState } from "react";

type UseLinkGeneratorProps = {
  getMailLink: (id: string) => Promise<string>;
  showNotice: (message: string) => void;
};
export default function useLinkGenerator({
  getMailLink,
  showNotice,
}: UseLinkGeneratorProps) {
  const [mailLinks, setMailLinks] = useState<Record<string, string>>({});
  const [appLinks, setAppLinks] = useState<Record<string, string>>({});
  const [qrCodeLinks, setQrCodeLinks] = useState<Record<string, string>>({});

  async function createMailLink(videoId: string): Promise<void> {
    if (mailLinks[videoId]) return;

    try {
      const link = await getMailLink(videoId);

      if (!link || link === "") {
        showNotice(
          "Die Mail-Link-Generierung ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
        );
      }

      setMailLinks((prev) => ({
        ...prev,
        [videoId]: link,
      }));
    } catch (e) {
      console.error(e);
      setMailLinks((prev) => ({
        ...prev,
        [videoId]: "",
      }));
    }
  }

  async function createQRCodeLink(videoId: string): Promise<void> {
    if (qrCodeLinks[videoId]) return;

    let link = mailLinks[videoId];

    if (!link) {
      link = await getMailLink(videoId);
    }
    if (!link || link === "") {
      showNotice(
        "Die Mail-Link-Generierung ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
      );
    }

    if (!link || link === "") return;
    setQrCodeLinks((prev) => ({
      ...prev,
      [videoId]: link,
    }));
  }

  function createAppLink(videoId: string): void {
    if (appLinks[videoId]) return;

    try {
      const link = `https://cdn.equeo.de/manifests/${videoId}.m3u8`;
      setAppLinks((prev) => ({
        ...prev,
        [videoId]: link,
      }));
    } catch (e) {
      console.error(e);
      setAppLinks((prev) => ({
        ...prev,
        [videoId]: "-",
      }));
    }
  }
  return {
    mailLinks,
    createMailLink,
    appLinks,
    createAppLink,
    qrCodeLinks,
    createQRCodeLink,
  };
}
