interface VideoMetaData  {
    author: string;
    category: null | string;
    custom_params: Record<string, unknown>;
    description: string;
    drm: boolean;
    external_id: null | string;
    language: null | string;
    permalink: string;
    protection_rule_key?: null | string;
    publish_end_date?: null | string; // JSON Datetime
    publish_start_date: string; // JSON Datetime
    tags?: string[];
    title: string;
}

export type Video = {
    id: string;
    duration: number; // float/double
    created: string; // JSON Datetime
    metadata: VideoMetaData;
    error_message: null | string;
    external_id: null | string;
    hosting_type: "external" | "hosted"  | "renditions";
    last_modified: string; // JSON Datetime
    media_type: "audio" | "video";
    mime_type: null | string;
    relationships: Record<string, unknown>;
    schema: null | unknown;
    source_url: null | string;
    "status": "ready" | "created" | "processing" | "updating" | "failed";
    "trim_in_point": null | number;
    "trim_out_point": null | number;
    "type": "media"
};
