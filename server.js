// all imports
const next = require("next");
const multer = require("multer");
const express = require("express");
const { mkdir } = require("fs/promises");
const crypto = require("crypto");
const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const { PrismaClient } = require("@prisma/client");
// variable declaration
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 9999;

// utils function start from here

function getAlgorithm(keyBase64) {
  var key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
}

const encrypt = (plainText, keyBase64, ivBase64) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (messagebase64, keyBase64, ivBase64) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(messagebase64, "hex");
  decrypted += decipher.final();
  return decrypted;
};

const postRes = (request, response) => {
  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = process.env.FEES_WORKING_KEY, //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  request.on("data", function (data) {
    ccavEncResponse += data;
    ccavPOST = qs.parse(ccavEncResponse);
    var encryption = ccavPOST.encResp;
    ccavResponse = decrypt(encryption, keyBase64, ivBase64);
  });

  request.on("end", function () {
    var pData = "";
    pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
    pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
    pData = pData.replace(/&/gi, "</td></tr><tr><td>");
    pData = pData + "</td></tr></table>";
    htmlcode =
      '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
      pData +
      "</center><br></body></html>";
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(htmlcode);
    response.end();
  });
};

const postReq = (request, response) => {
  var body = "",
    workingKey = process.env.FEES_WORKING_KEY, //Put in the 32-Bit key shared by CCAvenues.
    accessCode = process.env.FEES_ACCESS_CODE, //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  request.on("data", function (data) {
    body += data;
    encRequest = encrypt(body, keyBase64, ivBase64);
    formbody =
      '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
      encRequest +
      '"><input type="hidden" name="access_code" id="access_code" value="' +
      accessCode +
      '"><script language="javascript">document.redirect.submit();</script></form>';
  });

  request.on("end", function () {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(formbody);
    response.end();
  });
  return;
};

// utils function end here

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// file storage configuration start from here
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

// file storage configuration end here

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

  server.get("/payamount", async function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(
      `<html><head><style>@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);body{font-family:Roboto,sans-serif}</style></head><body><div style="width:100%;height:100vh;background-color:#eee;display:grid;place-items:center"><h1>LOADING...</h1></div><form method="POST" name="customerData" action="/ccavRequestHandler"><table width="40%" height="100" align="center"><input type="hidden" name="merchant_id" id="merchant_id" value="${3428043}"> <input type="hidden" name="billing_country" value="India"> <input type="hidden" name="billing_state" value="DN"> <input type="hidden" name="cancel_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="redirect_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="language" id="language" value="EN"> <input type="hidden" name="billing_zip" value="396220"> <input type="hidden" name="order_id" value="" id="order_id"> <input type="hidden" name="currency" value="INR"> <input type="hidden" name="amount" value="" id="amount"> <input type="hidden" name="merchant_param1" value="" id="purpose"><tr style="visibility:hidden"><td></td><td><input type="submit" value="Checkout" id="submit"></td></tr></table></form><script>const init = async () => { var url_string = window.location.href; var url = new URL(url_string); var amount = url.searchParams.get("xlmnx"); var id = url.searchParams.get("ynboy"); var purpose = url.searchParams.get("zgvfz"); document.getElementById("order_id").value = id; document.getElementById("amount").value = amount; document.getElementById("purpose").value = purpose; setTimeout(function () { document.getElementById("submit").click();}, 500); };window.addEventListener("load", init);</script></body></html>`
    );
    response.end();
  });

  server.post("/ccavRequestHandler", function (request, response) {
    postReq(request, response);
  });

  server.post("/ccavResponseHandler", function (request, response) {
    postRes(request, response);
  });
  server.get("/rec", function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write("Hello World!");
    response.end();
  });

  // server.post("/getuser", async function (request, response) {
  //   const prisma = new PrismaClient();
  //   const allusers = await prisma.user.findMany({
  //     where: { status: "ACTIVE" },
  //   });
  //   response.json(allusers);
  // });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`------------> Ready on http://localhost:${port}`);
  });
});
