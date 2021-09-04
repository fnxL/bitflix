### Changelogs v0.0.5

- Dropped filter & sort by quality idea
- Simply sort the file by its size. Size ∝ Quality
- Get Links based on Platform (Android & Web)
- Get Links for 2160p, 1080p & 720p depending on platform type
- Get files with mimeType of `video/mp4` if client isFireFox as firefox wont support mkv.
- While searching for a file simply just for `${MovieName} + ${releaseYear} + 1080 / 720` to get the maximum results. Do not include `p` at the end.
- Added morgan, chalk

### Changelogs v0.0.4

- Implemented a sortStreamLinks function to sort the files by quality. Abstraction in /utils.js file.
- Fix streamLinks format.

### Changelogs v0.0.3

createQuery - filter video files based on conditions
streamLinks will return videos which do not have 'hindi', 'x265', 'hevc', 'sample' in their fulltext by default.

### Changelogs v0.0.2

- Implemented streamlinks route to fetch streamlinks of movie/show name provided.
- Created a validation service just in case of refresh_token expiry.
- Fix ESLint config

### Changelogs v0.0.1

- Created a driveAPI service in `/service/drive`
- Installed [config](https://www.npmjs.com/package/config) npm module for easy access of credentials and token `/config`
- Refactored existing routes.
- Configured eslint with prettier (airbnb-styleguide)

## TODO

- Convert api credentials to env.

//DETA CREDS
c0jfiuo4_9tHW73H1AbXoUg9fAHiXNL1WiNfYNnqD

c0jfiuo4
https://a90fv9.deta.dev
