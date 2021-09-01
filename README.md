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
