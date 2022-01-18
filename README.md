# Bitflix

A fullstack OTT Streaming platform built over Google Drive API & Next.js to stream any title (most) in highest possible quality.

## 🎯 About

This is a fully functional video streaming OTT platform.

You can choose to click on any title/show/movie to stream in the highest possible quality (likes of 4K, REMUXES, Bluray, HDR 10bit, etc if available) with support for English Subtitles (if any).

Since the most web browsers only supports playback of video files which are encoded with x264 codec and firefox only supports .mp4 containers so the search is limited to x264 video files so the WEB version has might have less content than the Android version.

The files are sourced direclty from my Google Drive and sizes range anywhere from 10GB to 80GB.

### Motive

The main motive for this project is to watch content in highest possible quality on my 4K android TV, as quality is everything to make watching experience a feast to the eyes. Each movie release is different and its quality is defined by the SOURCE (REMUX, Bluray, WEBDL, WEBRip, etc), Bitrate, resolution and the audio quality and various other factors. Below is the order from highest quality to lowest ones.

0. REMUXES
1. Bluray/Blu-Ray encodes
2. BDRip
3. WEB-DL
4. BRRip
5. WEBRip
6. HDRip

### Process Flow:

// TODO - Flow Diagram & Database Schema

User Clicks a movie/show  
--> Client sends request to server with required details to fetch streamlinks  
--> Server makes a search request under the hood to Google Drive to find video files corresponding to the title  
--> Server then responds with stream links of that title in various qualities depending on the platform (android/web) sorted by file size in descending order.  
--> Client requests for subtitles from the server and then converts the file to VTT (in memory Blob)  
--> Client starts playing the media.
This is possible because of the route which streams/serves the video files directly from google drive, it just needs the ID of the file in google drive.

**This project is intended to be used for personal use only and will not be made public for obvious legal reasons.**

## 🚀 Technologies

### Back End

- [NodeJS](http://nodejs.org)
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js
- [PostgreSQL](https://www.postgresql.org/) - as RDB.
- [Prisma](https://www.prisma.io/) - Next-gen ORM for PostgreSQL
- [GoogleAPIs](https://googleapis.dev/nodejs/googleapis/latest/) - To communicate with Drive API
- [JSONSchema](https://www.npmjs.com/package/celebrate) - For input validation
- [typedi](https://www.npmjs.com/package/typedi) - Dependency Injection library
- [Pino](https://getpino.io/#/) - Logging service
- [opensubtitles-api](https://www.npmjs.com/package/opensubtitles-api) - opensubtitles.org api wrapper for nodejs to get subtitles of specific titles.
- [typebox](https://www.npmjs.com/package/@sinclair/typebox) - For creating JSONSchemas & types in one go

## To do

- Multiple Profiles for each user
- Design a tracking system for tv/shows, watch progress
- Add features to create watch lists
- Integrate with trakt.

## Acknowledgements

- [Google Drive API reference](https://developers.google.com/drive/api/v3/reference)
- [Heroku](https://heroku.com) - For backend deployment
- [Media Type and format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
- [Partial Content & Range Requests](https://medium.com/@vishal1909/how-to-handle-partial-content-in-node-js-8b0a5aea216)
