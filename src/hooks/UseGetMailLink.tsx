import useAuth from "@/auth/useAuth.ts";
import { useCallback } from "react";

export default function useLinkGenerator() {
  const { getAccessToken } = useAuth();

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const getMailLink = useCallback(
    async (id: string) => {
      try {
        const token = await getAccessToken();
        if (!token) {
          return;
        }
        const response = await fetch(
          `https://ergopro-ecloud.equeo.de/rest/v1/videos/renditions/${id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );

        if (!response.ok) {
          return "";
        }
        const result = await response.json();
        const renditions = result.media_renditions;

        if (renditions.length === 0) {
          return "";
        }

        const videoRenditions = renditions.filter(
          (r: { media_type: string }) => {
            return r.media_type === "video";
          },
        );

        if (videoRenditions.length === 0) {
          return "";
        }

        const allVideosReady = videoRenditions.every(
          (r: { delivery_url: string }) => {
            return (
              typeof r.delivery_url === "string" && r.delivery_url.trim() !== ""
            );
          },
        );

        if (!allVideosReady) {
          return "";
        }

        const video = videoRenditions.sort(
          (a: { height: number }, b: { height: number }) => b.height - a.height,
        )[0];

        const url = video.delivery_url.replace(
          "cdn.jwplayer.com",
          "cdn.equeo.de",
        );
        return url;
      } catch (e) {
        console.error(e);
        return "";
      }
    },
    [getAccessToken],
  );

  async function pollForMailLink(
    id: string,
    maxAttempts = 1000,
    delay = 5000,
  ): Promise<string> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const mailUrl = await getMailLink(id);

      if (mailUrl && mailUrl !== "") {
        return mailUrl;
      }
      await wait(delay);
    }
    return "";
  }
  return { getMailLink, pollForMailLink };
}
