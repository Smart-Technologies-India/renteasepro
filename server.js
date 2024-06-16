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
const axios = require("axios");

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
  const prisma = new PrismaClient();

  var ccavEncResponse = "",
    ccavResponse = "",
    // workingKey = "E01FEB879F6B09AA29F8B6AAFD28B930", //Put in the 32-Bit key shared by CCAvenues.
    workingKey = "370F518A36775EFEA425EB27C8DC0CC6", //Put in the 32-Bit key shared by CCAvenues.
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

  request.on("end", async function () {
    const keysToKeep = [
      "order_id",
      "tracking_id",
      "bank_ref_no",
      "order_status",
      "payment_mode",
      "card_name",
      "amount",
      "billing_name",
      "merchant_param1",
    ];

    const pairs = ccavResponse.split("&");
    const result = {};
    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");

      if (keysToKeep.includes(key)) {
        result[key] = value === "null" ? null : decodeURIComponent(value);
      }
    });

    if (result.order_status == "Aborted") {
      const htmlcode = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abort</title><script src="https://cdn.tailwindcss.com"></script></head><body><main class="h-screen w-full bg-[#eeeeee] grid place-items-center"><div class="w-96 bg-white rounded-lg p-6"><h1 class="text-rose-500 text-4xl text-center font-semibold">Abort</h1><div class="h-[1px] bg-gray-400 w-full mt-2"></div><p class="text-xl text-slate-700 text-center font-medium mt-4">Payment declined by client.</p><div class="flex item-center gap-6 mt-4"><a href="https://pdadnhrent.com/dashboard" class="grow py-1 text-center rounded-lg bg-blue-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"/></svg><p>Home</p></a><a href="https://pdadnhrent.com/contact_about" class="grow py-1 text-center rounded-lg bg-rose-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"/></svg><p>Contact</p></a></div></div></main></body></html>`;
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    } else if (result.order_status == "Success") {
      const bidid = result.merchant_param1.toString().split("_")[0];
      const userid = result.merchant_param1.toString().split("_")[1];
      const shopid = result.merchant_param1.toString().split("_")[2];
      const type = result.merchant_param1.toString().split("_")[3];
      const mobile_number = result.merchant_param1.toString().split("_")[4];

      if (type == "bid") {
        const update_response = await prisma.bid_payment.updateMany({
          where: {
            userId: userid ? parseInt(userid) : 0,
            shopId: shopid ? parseInt(shopid) : 0,
            bidId: bidid ? parseInt(bidid) : 0,
          },
          data: {
            transactionid: result.bank_ref_no,
            trackid: result.tracking_id,
            transaction_date: new Date().toISOString(),
            paymentmode: result.payment_mode.toString().toUpperCase(),
            remarks: result.order_status,
            status: "ACTIVE",
          },
        });

        const update_payment = await prisma.bid_transact.updateMany({
          where: {
            status: "INACTIVE",
            userId: userid ? parseInt(userid) : 0,
            shopId: shopid ? parseInt(shopid) : 0,
            bidId: bidid ? parseInt(bidid) : 0,
          },
          data: {
            status: "ACTIVE",
          },
        });

        console.log("update_payment", update_payment);

        const NewBidSubmitted = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Thank%20you%20for%20submitting%20your%20bid.%20We%20have%20received%20it%20successfully.%20You%20will%20be%20notified%20of%20any%20updates%20or%20further%20actions.%20-%20PDA%2C%20DNH.&MobileNumbers=91${mobile_number}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

        await axios.get(NewBidSubmitted);
      } else if (type == "rent") {
        let updatedata;

        const id_value = bidid.split(",").map((id) => parseInt(id));

        for (let i = 0; i < id_value.length; i++) {
          updatedata = await prisma.rent_transact.update({
            where: {
              id: id_value[i],
            },
            data: {
              transactionid: result.bank_ref_no,
              trackid: result.tracking_id,
              status: "PAID",
              transaction_date: new Date().toISOString(),
              paymentmode: result.payment_mode.toString().toUpperCase(),
              remarks: result.order_status,
            },
            include: {
              user: true,
              shop: {
                include: {
                  property: true,
                  shop_category: true,
                },
              },
            },
          });
        }

        // const update_response = await prisma.rent_transact.updateMany({
        //   where: {
        //     id: {
        //       in: bidid.split(",").map((id) => parseInt(id)),
        //     },
        //   },
        //   data: {
        //     transactionid: result.bank_ref_no,
        //     trackid: result.tracking_id,
        //     status: "PAID",
        //     transaction_date: new Date().toISOString(),
        //     paymentmode: result.payment_mode.toString().toUpperCase(),
        //     remarks: result.order_status,
        //   },
        //   include: {
        //     user: true,
        //     shop: {
        //       include: {
        //         property: true,
        //         shop_category: true,
        //       },
        //     },
        //   },
        // });

        const RentIsPaid = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Confirmation%3A%20Your%20rent%20for%20${updatedata.shop.shop_category.name}%20at%20${updatedata.shop.property.name}%20has%20been%20paid.%20We%20appreciate%20your%20timely%20payment%20-DNH%20PDA.&MobileNumbers=91${updatedata.user.contactone}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

        const message_response = await fetch(RentIsPaid, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const htmlcode = `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Success</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            min-height: 100vh;
            background-color: #eee;
            display: grid;
            place-items: center;
          }
          main {
            width: 400px;
            background-color: #fff;
            border-radius: 20px;
            padding: 20px;
          }
          .title {
            text-align: center;
            color: #22c55e;
            font-size: 30px;
            font-family: "Roboto", sans-serif;
          }
          .subtitle {
            text-align: center;
            color: #333;
            font-size: 18px;
            font-family: "Roboto", sans-serif;
            background: linear-gradient(to left, #bfdbfe, #fed7aa);
            border-radius: 5px;
            padding: 4px 0;
            margin-top: 20px;
            font-weight: 500;
          }
          #date {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
            margin-top: 20px;
          }
          .header {
            font-family: "Roboto", sans-serif;
            background: linear-gradient(to left, #bfdbfe, #fed7aa);
            text-align: center;
            padding: 10px;
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
            margin-top: 20px;
          }
          .header .price {
            font-weight: 700;
            font-size: 24px;
          }
          .paymentdetails {
            border: 1px solid #eee;
            padding: 10px;
          }
          .paymentdetails .main {
            display: flex;
            justify-content: space-between;
            margin: 6px 0px;
          }
          .paymentdetails .main .prop {
            font-weight: 400;
            color: #9ca3af;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
          }
          .paymentdetails .main .value {
            color: #333;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
            font-weight: 400;
          }
          .btnbox {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .btnone {
            display: flex;
            align-items: center;
            padding: 4px 20px;
            background-color: #3b82f6;
            border-radius: 5px;
            color: #fff;
            text-decoration: none;
            font-size: 20px;
            font-family: "Roboto", sans-serif;
            font-weight: 500;
          }
          .btntwo {
            display: flex;
            align-items: center;
            padding: 4px 20px;
            background-color: #f43f5e;
            border-radius: 5px;
            color: #fff;
            text-decoration: none;
            font-size: 20px;
            font-family: "Roboto", sans-serif;
            font-weight: 500;
          }
          .btnone svg,
          .btntwo svg {
            margin-right: 10px;
            transform: scale(0.8);
          }
        </style>
      </head>
    
      <body>
        <main>
          <h1 class="title">Transaction Successful</h1>
    
          <p class="subtitle">Transaction ID : ${result.tracking_id}</p>
          <p id="date"></p>
          <div class="header">
            <p>Total Amount Transfered</p>
            <p class="price">₹ ${result.amount}</p>
          </div>
          <div class="paymentdetails">
            <div class="main">
              <div class="prop">Order ID</div>
              <div class="value">${result.order_id}</div>
            </div>
            <div class="main">
              <div class="prop">Paid For</div>
              <div class="value">${result.billing_name}</div>
            </div>
            <div class="main">
              <div class="prop">Bank Ref Number</div>
              <div class="value">${result.bank_ref_no}</div>
            </div>
            <div class="main">
              <div class="prop">Payee Name</div>
              <div class="value">${result.billing_name}</div>
            </div>
            <div class="main">
              <div class="prop">To</div>
              <div class="value">PDA, DNH</div>
            </div>
            <div class="main">
              <div class="prop">Payment Type</div>
              <div class="value">${result.payment_mode}</div>
            </div>
          </div>
    
          <div class="btnbox">
            <a href="https://pdadnhrent.com/dashboard" class="btnone" target="_self">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"
                />
              </svg>
              <p>Home</p>
            </a>
            <a href="https://pdadnhrent.com/contact_about" class="btntwo" target="_self">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"
                />
              </svg>
              <p>Contact</p>
            </a>
          </div>
        </main>
        <script>
          document.getElementById("date").innerHTML = new Date().toDateString();
        </script>
      </body>
    </html>
    `;

      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    } else {
      const htmlcode = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Failed</title><script src="https://cdn.tailwindcss.com"></script></head><body><main class="h-screen w-full bg-[#eeeeee] grid place-items-center"><div class="w-96 bg-white rounded-lg p-6"><h1 class="text-rose-500 text-4xl text-center font-semibold">Failed</h1><div class="h-[1px] bg-gray-400 w-full mt-2"></div><p class="text-xl text-slate-700 text-center font-medium mt-4">Payment Failed.</p><div class="flex item-center gap-6 mt-4"><a href="https://pdadnhrent.com/dashboard" class="grow py-1 text-center rounded-lg bg-blue-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"/></svg><p>Home</p></a><a href="https://pdadnhrent.com/contact_about" class="grow py-1 text-center rounded-lg bg-rose-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"/></svg><p>Contact</p></a></div></div></main></body></html>`;
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    }

    // var pData = "";
    // pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
    // pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
    // pData = pData.replace(/&/gi, "</td></tr><tr><td>");
    // pData = pData + "</td></tr></table>";
    // htmlcode =
    //   '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
    //   pData +
    //   "</center><br></body></html>";
    // response.writeHeader(200, { "Content-Type": "text/html" });
    // response.write(htmlcode);
    // response.end();
  });
};

const postReq = (request, response) => {
  var body = "",
    // workingKey = "E01FEB879F6B09AA29F8B6AAFD28B930", //Put in the 32-Bit key shared by CCAvenues.
    workingKey = "370F518A36775EFEA425EB27C8DC0CC6", //Put in the 32-Bit key shared by CCAvenues.
    // accessCode = "AVCG05LD66BH75GCHB", //Put in the Access Code shared by CCAvenues.
    accessCode = "AVHK88LE92BW69KHWB", //Put in the Access Code shared by CCAvenues.
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
      `<html><head><style>@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);body{font-family:Roboto,sans-serif}</style></head><body><div style="width:100%;height:100vh;background-color:#eee;display:grid;place-items:center"><h1>LOADING...</h1></div><form method="POST" name="customerData" action="/ccavRequestHandler"><table width="40%" height="100" align="center"><input type="hidden" name="merchant_id" id="merchant_id" value="${3428042}"> <input type="hidden" name="billing_country" value="India"> <input type="hidden" name="billing_state" value="DN"> <input type="hidden" name="cancel_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="redirect_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="language" id="language" value="EN"> <input type="hidden" name="billing_zip" value="396220"> <input type="hidden" name="order_id" value="" id="order_id"> <input type="hidden" name="currency" value="INR"> <input type="hidden" name="amount" value="" id="amount"> <input type="hidden" name="merchant_param1" value="" id="purpose"><tr style="visibility:hidden"><td></td><td><input type="submit" value="Checkout" id="submit"></td></tr></table></form><script>const init = async () => { var url_string = window.location.href; var url = new URL(url_string); var amount = url.searchParams.get("xlmnx"); var id = url.searchParams.get("ynboy"); var purpose = url.searchParams.get("zgvfz"); document.getElementById("order_id").value = id; document.getElementById("amount").value = amount; document.getElementById("purpose").value = purpose; setTimeout(function () { document.getElementById("submit").click();}, 500); };window.addEventListener("load", init);</script></body></html>`
    );
    response.end();
  });

  server.post("/ccavRequestHandler", function (request, response) {
    postReq(request, response);
  });

  server.post("/ccavResponseHandler", function (request, response) {
    postRes(request, response);
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
