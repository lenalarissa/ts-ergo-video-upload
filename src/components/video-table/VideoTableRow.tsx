import copy from "copy-to-clipboard";
import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import downloadIcon from "@/assets/datei-download.svg";
import { QRCodeSVG } from "qrcode.react";
import {
  convertDuration,
  formatDateTime,
  createThumbnailLink,
} from "@/utils/videoTableUtilities.ts";
import type { Video } from "@/types/video";
import { useRef } from "react";
import handleDownloadQRCode from "@/utils/handleDownloadQRCode";
import useLinkGenerator from "@/hooks/UseLinkGenerator.tsx";
import useGetMailLink from "@/hooks/UseGetMailLink.tsx";

type VideoTableRowProps = {
  video: Video;
  showNotice: (message: string) => void;
};

export default function VideoTableRow({
  video,
  showNotice,
}: VideoTableRowProps) {
  const { getMailLink } = useGetMailLink();

  const {
    appLinks,
    createAppLink,
    mailLinks,
    createMailLink,
    qrCodeLinks,
    createQRCodeLink,
  } = useLinkGenerator({ getMailLink, showNotice });

  const mailLink = mailLinks?.[video.id];
  const appLink = appLinks?.[video.id];
  const qrCodeLink = qrCodeLinks?.[video.id];

  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const title = video.metadata.title;
  const duration = convertDuration(video.duration);
  const created = formatDateTime(video.created);
  return (
    <tr key={video.id} className="align-middle even:bg-white odd:bg-gray-100">
      <td className="px-4 sm:px-6 py-2 sm:py-4">
        <div className="flex items-center gap-3 min-w-88">
          <img
            className="w-32 flex-none"
            src={createThumbnailLink(video.id)}
            alt="Thumbnail"
          />
          <p className="min-w-0 flex-1 wrap-anywhere pr-8">{title}</p>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
        {duration}
      </td>
      <td className="px-4 sm:px-6 py-2 sm:py-4 align-middle">
        <div className="flex flex-col ">
          <p className="whitespace-nowrap">{created.formattedDate}</p>
          <p className="whitespace-nowrap">{created.formattedTime}</p>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-2 sm:py-4">
        {!appLink && (
          <button
            type="button"
            className="underline cursor-pointer hover:text-blue-400"
            onClick={() => createAppLink(video.id)}
          >
            anzeigen
          </button>
        )}
        {appLink && (
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={appLink}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 flex-1 wrap-anywhere"
            >
              {appLink}
            </a>
            <button
              className="w-4 h-4 cursor-pointer flex-none"
              onClick={() => copy(appLink)}
              type="button"
            >
              <img src={copyIcon} alt="Kopieren Icon" />
            </button>
          </div>
        )}
      </td>

      <td className="px-4 sm:px-6 py-2 sm:py-4">
        {!mailLink && (
          <button
            type="button"
            className="underline cursor-pointer hover:text-blue-400"
            onClick={() => createMailLink(video.id)}
          >
            anzeigen
          </button>
        )}
        {mailLink && (
          <div className="flex items-center gap-3 min-w-0">
            <a
              href={mailLink}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 flex-1 wrap-anywhere"
            >
              {mailLink}
            </a>
            <button
              className="w-4 h-4 cursor-pointer flex-none"
              onClick={() => copy(mailLink)}
              type="button"
            >
              <img src={copyIcon} alt="Kopieren Icon" />
            </button>
          </div>
        )}
      </td>

      <td className="px-4 sm:px-6 py-2 sm:py-4">
        {!qrCodeLink && (
          <button
            type="button"
            className="underline cursor-pointer hover:text-blue-400"
            onClick={() => createQRCodeLink(video.id)}
          >
            anzeigen
          </button>
        )}
        {qrCodeLink && (
          <div
            ref={qrCodeRef}
            className="flex items-center justify-between gap-1"
          >
            <QRCodeSVG value={qrCodeLink} size={80} />
            <button
              className="w-8 h-8 p-1 cursor-pointer"
              onClick={() => handleDownloadQRCode(qrCodeRef.current, video.id)}
              type="button"
              aria-label="SVG herunterladen"
            >
              <img src={downloadIcon} alt="Download Icon" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
