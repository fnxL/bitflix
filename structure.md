--> To get that mp4 file stream from drive
//2-3 Month....
//Best Practices,Folder Structure
//Backend - Testing & Debugging...
//Front-End - Jest/Unit Testing. Improve Performance. Deep Dive. Context API - Redux
//DRY
//PORT TO ANDROID TO SUPPORT x265.

api/streamlinks(name,year) Schema = {
"720": [strings], //10 links
"1080": [strings],
"2160": [strings]
}

1. Backend
   -> Auth System...
   -> Routes
   //Movie
   -> GET 'api/streamlinks?name=<Movie.Name>&year=<Year>' return (streaming links) -->  
    crawl --> 10 find specific file (id,driveStream) --> bitflix.com/api/download?fileid+.

   -> hostname: 'api/download?id,name,auth(encoded)' --> get/download file from DriveAPI using auth.

2. Front End
   --> TMBD API --> Display all popular lists...
   --> User clicks on some movie --> GET 'api/streamlinks' --> setState --> Embed url src --> Play.

   Features -->
   Watch History --> Watch List

   <video src="downloadUrl">
