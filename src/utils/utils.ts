// 1. Bluray/Blu-Ray encodes
// 2. BDRip
// 3. WEB-DL
// 4. BRRip
// 5. WEBRip
// 6. HDRip

import { StreamLinksRequestType } from "../types-and-schemas";
import { MediaType } from "../types-and-schemas";

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

// export const detectKeywords = (string) => {
//   const detectedkeywordsList = [];
//   keywords.forEach((e) => {
//     // perform exact word match  for these so they don't interfere with rest of acronyms
//     if (e === 'hdr' || e === '10bit' || e === 'hdrip') {
//       const x = new RegExp(`\\b ${e} \\b`, 'i'); // exact full word match
//       const result = string.match(x);
//       if (result) detectedkeywordsList.push(result[0]);
//     } else {
//       const x = new RegExp(e, 'i'); // exact full word match
//       const result = string.match(x);
//       if (result) detectedkeywordsList.push(result[0]);
//     }
//   });
//   return detectedkeywordsList;
// };

// export const getIndexOf = (keywordList, order) => {
//   let result;
//   for (let i = 0; i < order.length; i++) {
//     let found = true;

//     order[i].forEach((item) => {
//       if (!keywordList.includes(item)) found = false;
//     });
//     keywordList.forEach((item) => {
//       if (!order[i].includes(item)) found = false;
//     });

//     if (found) {
//       result = i;
//       break;
//     }
//     // if (result) return true;
//   }
//   return result;
// };

// export const sortBy = (files, order) => {
//   const newList = files.sort((a, b) => {
//     // handle for lists split by `.`
//     const fileA = a.name.toLowerCase();
//     const fileB = b.name.toLowerCase();
//     const keywordsA = detectKeywords(fileA);
//     const keywordsB = detectKeywords(fileB);

//     const sourceIndexA = getIndexOf(keywordsA, order);
//     const sourceIndexB = getIndexOf(keywordsB, order);

//     // below code works only if sortOrder is provided in descending order of their lengths

//     // console.log(sourceIndexA);
//     // console.log(sourceIndexB);
//     // let assignedA = false;
//     // let assignedB = false;
//     // // todo
//     // let checkA = true;
//     // let checkB = true;

//     // for (let i = 0; i < order.length; i++) {
//     //   if (Array.isArray(order[i])) {
//     //     checkA = true;
//     //     checkB = true;
//     //     order[i].forEach((e) => {
//     //       if (!fileA.includes(e)) {
//     //         checkA = false;
//     //       }
//     //       if (!fileB.includes(e)) {
//     //         checkB = false;
//     //       }
//     //     });

//     //     if (!assignedA && checkA) {
//     //       sourceIndexA = i;
//     //       assignedA = true;
//     //     }
//     //     if (!assignedB && checkB) {
//     //       sourceIndexB = i;
//     //       assignedB = true;
//     //     }
//     //   }
//     // }

//     return sourceIndexA - sourceIndexB;
//   });
//   return newList;
// };

// data2.forEach((e) => {
//   const keywordss = detectKeywords(e.name);
//   console.log(keywordss);
// });

// export const sortByFileSize = (files) => {
//   const sorted = files.sort((a, b) => {
//     const sizeA = parseInt(a.size, 10);
//     const sizeB = parseInt(b.size, 10);
//     return sizeB - sizeA;
//   });
//   return sorted;
// };

// export const filterAndSort = (files, fileName) => {
//   const keywordsx = fileName.split(" ");
//   const keywordsArray = keywordsx.map((word) => word.toLowerCase());
//   const fileArray = files.map((file) => ({
//     ...file,
//     name: file.name.toLowerCase(),
//   }));

//   const filtered = fileArray.filter((file) => {
//     const name = file.name.split(".");
//     let check = true;
//     for (let i = 0; i < keywordsArray.length; i++) {
//       if (!name.includes(keywordsArray[i])) {
//         check = false;
//         break;
//       }
//     }
//     return check;
//   });
//   return sortByFileSize(filtered);
// };

export const cleanFileName = (str: string) => {
  const stripPunct = str.replace(
    /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|"|:|'|<|,|\|>|\?|\/|\\|\||-|_|\+|=)/g,
    ""
  ); // remove punctuation,
  const cleanabr = stripPunct.replace(/.(?:\.[A-Za-z]\.[A-Za-z])/gm, ""); // remove abbreviations

  const trailing = cleanabr.replace(/^[ \t]+|[ \t]+$/gm, "");
  return trailing;
};

export const getSearchTerm = (data: StreamLinksRequestType) => {
  const { title, year, seasonNumber, episodeNumber } = data;
  const cleanedTitle = cleanFileName(title);
  const type = data.type as MediaType;
  if (type === MediaType.TV)
    return `${cleanedTitle} S${seasonNumber! < 10 ? `0${seasonNumber}` : seasonNumber}E${
      episodeNumber! < 10 ? `0${episodeNumber}` : episodeNumber
    }`;
  return `${cleanedTitle} ${year}`;
};

export function routeOptions(
  responseBody: any,
  statusCode: number,
  requestBody?: any,
  preHandler?: any
) {
  if (!requestBody) {
    return {
      preHandler: preHandler,
      schema: {
        response: {
          [statusCode]: responseBody,
        },
      },
    };
  }
  return {
    preHandler: preHandler,
    schema: {
      body: requestBody,
      response: {
        [statusCode]: responseBody,
      },
    },
  };
}

// export function formatBytes(bytes, decimals = 2) {
//   if (!bytes) return undefined;

//   if (bytes === 0) return "0 Bytes";

//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   // eslint-disable-next-line no-restricted-properties
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
// }
