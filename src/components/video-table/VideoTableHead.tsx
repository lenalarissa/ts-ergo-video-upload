type VideoTableHeadProps = {
  sortTable: (key: string) => void;
  getSortIndicator: (key: string) => string;
};

export default function VideoTableHead({
  sortTable,
  getSortIndicator,
}: VideoTableHeadProps) {
  return (
    <thead className="text-body bg-neutral-secondary-soft border-b rounded-base border-default">
      <tr>
        <th
          className="px-6 py-3 cursor-pointer"
          onClick={() => sortTable("title")}
        >
          Titel{getSortIndicator("title")}
        </th>
        <th
          className="px-6 py-3 cursor-pointer"
          onClick={() => sortTable("duration")}
        >
          Länge{getSortIndicator("duration")}
        </th>
        <th
          className="px-6 py-3 cursor-pointer"
          onClick={() => sortTable("created")}
        >
          Upload{getSortIndicator("created")}
        </th>
        <th className="px-6 py-3 min-w-65">App Link</th>
        <th className="px-6 py-3 min-w-65">Mail Link</th>
        <th className="px-6 py-3">QR Code</th>
      </tr>
    </thead>
  );
}
