import VideoCard from "@/components/video-table/VideoCard.jsx";
import handleDownloadQRCode from "@/utils/handleDownloadQRCode.ts";
import useAuth from "@/auth/useAuth.js";
import type { Video } from "@/types/video";
import VideoTableHead from "@/components/video-table/VideoTableHead";
import VideoTableBody from "@/components/video-table/VideoTableBody";
import { useState, useEffect } from "react";

type VideoTableProps = {
  createMailLink: (id: string) => Promise<string>;
};

export default function VideoTable({ createMailLink }: VideoTableProps) {
  const { getAccessToken } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [mailLinks, setMailLinks] = useState<Record<string, string>>({});
  const [appLinks, setAppLinks] = useState<Record<string, string>>({});
  const [qrCodeLinks, setQrCodeLinks] = useState<Record<string, string>>({});

  const [page, setPage] = useState<number>(1);
  const [totalVideos, setTotalVideos] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>("created");
  const [sortOrder, setSortOrder] = useState<string>("dsc");
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(totalVideos / pageSize));

  function setPageClamped(targetPage: number) {
    const clamped = Math.min(Math.max(1, targetPage), totalPages);
    setPage(clamped);
  }

  function sortTable(column: string) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "dsc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  }

  function getSortIndicator(column: string) {
    if (sortBy === column) {
      return sortOrder === "asc" ? " ↑" : " ↓";
    } else {
      return "";
    }
  }

  useEffect(() => {
    const offset = (page - 1) * pageSize;

    const query = search ? `&search=${encodeURIComponent(search)}` : "";

    async function fetchVideos() {
      try {
        const token = await getAccessToken();
        if (!token) {
          return;
        }

        // default: sort=created und order=dsc
        // sort, but no order: asc als default
        // order, but nor sort: created als default
        const response = await fetch(
          `https://ergopro-ecloud.equeo.de/rest/v1/videos?tags=ergo,ergo%20pro&limit=50&offset=${offset}&sort=${sortBy}&order=${sortOrder}${query}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );
        const result = await response.json();
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.media)
            ? result.media
            : Array.isArray(result?.video)
              ? result.video
              : Array.isArray(result?.data)
                ? result.data
                : [];
        setVideos(list);
        setTotalVideos(Number(result.total || 0));
      } catch (e) {
        console.error(e);
      }
    }
    fetchVideos();
  }, [page, sortBy, sortOrder, search, getAccessToken]);

  function showNotice(message: string) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  async function handleLoadMailLink(videoId: string): Promise<void> {
    if (mailLinks[videoId]) return;

    try {
      const link = await createMailLink(videoId);

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

  async function handleGetQRCodeLink(videoId: string): Promise<void> {
    if (qrCodeLinks[videoId]) return;

    let link = mailLinks[videoId];

    if (!link) {
      link = await createMailLink(videoId);
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

  return (
    <div className="flex flex-col h-full">
      {notice && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded border border-black bg-white px-4 py-3 shadow-lg text-sm">
          {notice}
        </div>
      )}
      <div className="flex flex-1">
        <div className="w-full hidden lg:block overflow-x-auto">
          <div className="w-full px-4">
            {videos.length !== 0 && (
              <div>
                <div className="p-4 w-full">
                  <label htmlFor="search" className="sr-only">
                    Titel suchen
                  </label>
                  <div className="relative">
                    <div className="absolute flex items-center pointer-events-none"></div>
                    <input
                      type="text"
                      id="search"
                      className="block w-full ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 shadow-xs placeholder:text-body"
                      placeholder="Titel suchen"
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearch(searchInput);
                          setPage(1);
                        }
                      }}
                    />
                  </div>
                </div>
                <table className="table-fixed w-full text-xs sm:text-sm text-left rtl:text-right text-body">
                  <colgroup>
                    <col className="w-5/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                  </colgroup>
                  <VideoTableHead
                    sortTable={sortTable}
                    getSortIndicator={getSortIndicator}
                  />
                  <VideoTableBody
                    videos={videos}
                    mailLinks={mailLinks}
                    appLinks={appLinks}
                    qrCodeLinks={qrCodeLinks}
                    handleLoadMailLink={handleLoadMailLink}
                    handleGetQRCodeLink={handleGetQRCodeLink}
                    handleDownloadQRCode={handleDownloadQRCode}
                    createAppLink={createAppLink}
                  />
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="w-full p-2 block lg:hidden">
          <div>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                mailLinks={mailLinks}
                appLinks={appLinks}
                qrCodeLinks={qrCodeLinks}
                handleLoadMailLink={handleLoadMailLink}
                handleGetQRCodeLink={handleGetQRCodeLink}
                handleDownloadQRCode={handleDownloadQRCode}
                createAppLink={createAppLink}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center p-4">
        <button
          type="button"
          onClick={() => setPageClamped(page - 1)}
          disabled={page <= 1}
          className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          Zurück
        </button>
        <span>
          Seite {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPageClamped(page + 1)}
          disabled={page >= totalPages}
          className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
