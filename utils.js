// 1. Bluray/Blu-Ray encodes
// 2. BDRip
// 3. WEB-DL
// 4. BRRip
// 5. WEBRip
// 6. HDRip

const data = require('./mockdata');

//
const sortOrder = [
  ['bluray', '10bit', 'hdr'],
  ['bluray', 'hdr'],
  ['bluray', '10bit'],
  ['bluray'],
  ['blu-ray'],
  ['bdrip'],
  ['web-dl', '10bit', 'hdr'],
  ['web-dl', 'hdr'],
  ['web-dl', '10bit'],
  ['web-dl'],
  ['webdl'],
  ['brrip'],
  ['br-rip'],
  ['webrip'],
  ['hdrip'],
];

// mock data
const data2 = [
  { name: 'Wrath.of.Man.2021.2160p.AMZN.WEB-DL.DDP5.1.HDR.HEVC-CMRG' },

  {
    name: 'Black.Widow.2021.2160p.DSNP.BluRay.x265.10bit.HDR.DDP5.1.Atmos-CM',
  },
  {
    name: 'Mulan 2020 WebRip 1080p English DD 5.1 x264 ESub - mkvCinemas [Telly].mkv',
  },
  {
    name: 'Mulan.2020.1080p.WEBRip.x264-RARBG.mp4',
  },
  {
    name: 'Mulan.2020.1080p.HDRip.mp4',
  },
  {
    name: 'Justice.League.Snyders.Cut.2021.2160p.HMAX.WEB-DLx265.10bit.HDR.DDP5.1.Atmos-SWTYBLZ',
  },
  {
    name: 'Mulan.2020.1080p.BluRay.x264-HDxT.mkv',
  },
  {
    name: 'Mulan.2020.HDR.1080p.BluRay.x264-HDxT.mkv',
  },
  {
    name: 'Mulan.2020.10bit.1080p.BluRay.x264-HDxT.mkv',
  },
];

// keywords to search for in the title
const keywords = [
  'bluray',
  'hdr',
  '10bit',
  'blu-ray',
  'bdrip',
  'web-dl',
  'webdl',
  'brrip',
  'webrip',
  'hdrip',
];

const detectKeywords = (string) => {
  const detectedkeywordsList = [];
  keywords.forEach((e) => {
    // perform exact word match  for these so they don't interfere with rest of acronyms
    if (e === 'hdr' || e === '10bit' || e === 'hdrip') {
      const x = new RegExp('\\b' + e + '\\b', 'i'); // exact full word match
      const result = string.match(x);
      if (result) detectedkeywordsList.push(result[0]);
    } else {
      const x = new RegExp(e, 'i'); // exact full word match
      const result = string.match(x);
      if (result) detectedkeywordsList.push(result[0]);
    }
  });
  return detectedkeywordsList;
};

const getIndexOf = (keywordList, order) => {
  let result;
  for (let i = 0; i < order.length; i++) {
    let found = true;

    order[i].forEach((item) => {
      if (!keywordList.includes(item)) found = false;
    });
    keywordList.forEach((item) => {
      if (!order[i].includes(item)) found = false;
    });

    if (found) {
      result = i;
      break;
    }
    // if (result) return true;
  }
  return result;
};

const sortBy = (files, order) => {
  const newList = files.sort((a, b) => {
    // handle for lists split by `.`
    const fileA = a.name.toLowerCase();
    const fileB = b.name.toLowerCase();
    const keywordsA = detectKeywords(fileA);
    const keywordsB = detectKeywords(fileB);

    const sourceIndexA = getIndexOf(keywordsA, order);
    const sourceIndexB = getIndexOf(keywordsB, order);

    // below code works only if sortOrder is provided in descending order of their lengths

    // console.log(sourceIndexA);
    // console.log(sourceIndexB);
    // let assignedA = false;
    // let assignedB = false;
    // // todo
    // let checkA = true;
    // let checkB = true;

    // for (let i = 0; i < order.length; i++) {
    //   if (Array.isArray(order[i])) {
    //     checkA = true;
    //     checkB = true;
    //     order[i].forEach((e) => {
    //       if (!fileA.includes(e)) {
    //         checkA = false;
    //       }
    //       if (!fileB.includes(e)) {
    //         checkB = false;
    //       }
    //     });

    //     if (!assignedA && checkA) {
    //       sourceIndexA = i;
    //       assignedA = true;
    //     }
    //     if (!assignedB && checkB) {
    //       sourceIndexB = i;
    //       assignedB = true;
    //     }
    //   }
    // }

    return sourceIndexA - sourceIndexB;
  });
  return newList;
};

// data2.forEach((e) => {
//   const keywordss = detectKeywords(e.name);
//   console.log(keywordss);
// });

module.exports = { sortBy, sortOrder };
