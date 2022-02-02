// 1. Bluray/Blu-Ray encodes
// 2. BDRip
// 3. WEB-DL
// 4. BRRip
// 5. WEBRip
// 6. HDRip

import bcrypt from "bcrypt";
import { drive_v3 } from "googleapis";
import { MediaType, Order, Quality, StreamLinksType } from "../media/schema";

const sortOrder = [
  ["bluray", "10bit", "hdr"],
  ["bluray", "hdr"],
  ["bluray", "10bit"],
  ["bluray"],
  ["blu-ray"],
  ["bdrip"],
  ["web-dl", "10bit", "hdr"],
  ["web-dl", "hdr"],
  ["web-dl", "10bit"],
  ["web-dl"],
  ["webdl"],
  ["brrip"],
  ["br-rip"],
  ["webrip"],
  ["hdrip"],
];

// keywords to search for in the title
const keywords = [
  "bluray",
  "hdr",
  "10bit",
  "blu-ray",
  "bdrip",
  "web-dl",
  "webdl",
  "brrip",
  "webrip",
  "hdrip",
];

enum FileThreshold {
  MOVIE_FHD = 1000000000, // 0.9GB
  MOVIE_HD = 500000000, // 500 MB
  TV_FHD = 300000000, // 300 MB
  TV_HD = 104857600, // 100 MB
}

export const filterAndSort = (
  files: drive_v3.Schema$File[],
  order: Order,
  type: MediaType,
  quality: Quality
) => {
  const sorted = files.sort((a, b) => {
    const sizeA = parseInt(a.size!, 10);
    const sizeB = parseInt(b.size!, 10);
    return order === Order.DESCENDING ? sizeB - sizeA : sizeA - sizeB;
  });

  const filtered = sorted.filter((file) => {
    const fileSize = parseInt(file.size!, 10);
    switch (type) {
      case MediaType.MOVIE: {
        switch (quality) {
          case Quality.FULL_HD: {
            return fileSize > FileThreshold.MOVIE_FHD;
          }
          case Quality.HD: {
            return fileSize > FileThreshold.MOVIE_HD;
          }
          default: {
            // TODO UHD Threshold
            return fileSize > FileThreshold.MOVIE_FHD;
          }
        }
      }
      case MediaType.TV: {
        switch (quality) {
          case Quality.FULL_HD: {
            return fileSize > FileThreshold.TV_FHD;
          }
          case Quality.HD: {
            return fileSize > FileThreshold.TV_HD;
          }
          default: {
            // TODO UHD Threshold
            return fileSize > FileThreshold.TV_FHD;
          }
        }
      }
      default: {
        break;
      }
    }
  });

  return filtered;
};

export const cleanFileName = (str: string) => {
  const stripPunct = str.replace(
    /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|"|:|'|<|,|\|>|\?|\/|\\|\||-|_|\+|=)/g,
    ""
  ); // remove punctuation,
  const cleanabr = stripPunct.replace(/.(?:\.[A-Za-z]\.[A-Za-z])/gm, ""); // remove abbreviations

  const trailing = cleanabr.replace(/^[ \t]+|[ \t]+$/gm, "");
  return trailing;
};

export const getSearchTerm = (data: StreamLinksType) => {
  const { title, year, seasonNumber, episodeNumber } = data;
  const cleanedTitle = cleanFileName(title);
  const type = data.type as MediaType;
  if (type === MediaType.TV)
    return `${cleanedTitle} S${seasonNumber! < 10 ? `0${seasonNumber}` : seasonNumber}E${
      episodeNumber! < 10 ? `0${episodeNumber}` : episodeNumber
    }`;
  return `${cleanedTitle} ${year}`;
};

export async function hash(password: string, saltRounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!bytes) return "0 Bytes";

  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
