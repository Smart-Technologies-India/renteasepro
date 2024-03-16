const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const multer = require("multer");
const express = require("express");
const { mkdir } = require("fs/promises");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 9999;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const filepath = __dirname + "/upload";
      await mkdir(filepath, { recursive: true });

      cb(null, filepath);
    } catch (err) {
      console.error("Error in destination function:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().getTime() + "_upload." + file.originalname.split(".").pop()
    );
  },
});

// Create multer instance with defined storage
const upload = multer({ storage: storage });

app.prepare().then(() => {
  const server = express();
  server.use("/upload", express.static(__dirname + "/upload"));

  server.post("/fileupload", upload.single("file"), (req, res) => {
    try {
      // If file uploaded successfully, you can handle it here
      // You can access uploaded file information via req.file
      const filePath = "/upload/" + req.file.filename;
      res.json({
        status: true,
        message: "File uploaded successfully",
        filePath: filePath,
      });
    } catch (error) {
      // If any error occurs during file upload or processing
      res.json({ status: false, message: "File upload failed" });
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`------------> Ready on http://localhost:${port}`);
  });

  //   createServer(async (req, res) => {
  //     try {
  //       // Be sure to pass `true` as the second argument to `url.parse`.
  //       // This tells it to parse the query portion of the URL.
  //       const parsedUrl = parse(req.url, true);

  //       //   const { pathname, query } = parsedUrl;
  //       //   if (pathname === "/a") {
  //       //     await app.render(req, res, "/a", query);
  //       //   } else if (pathname === "/b") {
  //       //     await app.render(req, res, "/b", query);
  //       //   } else {
  //       //     await handle(req, res, parsedUrl);
  //       //   }
  //       await handle(req, res, parsedUrl);
  //     } catch (err) {
  //       console.error("Error occurred handling", req.url, err);
  //       res.statusCode = 500;
  //       res.end("internal server error");
  //     }
  //   })
  //     .once("error", (err) => {
  //       console.error(err);
  //       process.exit(1);
  //     })
  //     .listen(port, () => {
  //       console.log(`> Ready on http://${hostname}:${port}`);
  //     });
});

// "scripts": {
//   "dev": "next dev -p 9999",
//   "build": "next build",
//   "start": "next start -p 9999",
// },
