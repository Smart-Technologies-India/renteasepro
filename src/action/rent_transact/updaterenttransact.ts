"use server";

import { errorToString } from "@/utils/methods";
import { ApiResponseType } from "@/models/response";
import prisma from "../../../prisma/database";
import axios from "axios";
import crypto from "crypto";

interface UpdateRentTrasactPayload {}

const UpdateRentTrasact = async (
  payload: UpdateRentTrasactPayload
): Promise<ApiResponseType<number | null>> => {
  try {
    // current date
    const new_date = new Date();

    // new date today + 20 day
    const new_date_n20 = new Date(
      new Date().setDate(new Date().getDate() + 20)
    );

    // curretn date today - 11 days
    const new_date_p11 = new Date(
      new Date().setDate(new Date().getDate() - 11)
    );

    // curretn date today - 29 days
    const new_date_p30 = new Date(
      new Date().setDate(new Date().getDate() - 29)
    );

    // now update the rent transact table according to the date if the date is greater than the current date then update the status to DUE and more then 11 then update the status to LATE and if the date is greater than 30 days then update the status to MONTHCROSS

    // due section start from here

    const rent_transact_response_due = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_n20,
        },
      },
      data: {
        status: "DUE",
      },
    });

    const get_due_rent = await prisma.rent_transact.findMany({
      where: {
        status: "DUE",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_n20,
        },
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

    if (get_due_rent.length > 0) {
      get_due_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.due != "SENT") {
          const response = await sent_due_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              due: "SENT",
            },
          });
        }
      });
    }

    // due section end here

    //  late section start from here

    const rent_transact_response_late = await prisma.rent_transact.updateMany({
      where: {
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p11,
        },
      },
      data: {
        status: "LATE",
      },
    });

    const get_late_rent = await prisma.rent_transact.findMany({
      where: {
        status: "LATE",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p11,
        },
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

    if (get_late_rent.length > 0) {
      get_late_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.late != "SENT") {
          const response = await send_late_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              late: "SENT",
            },
          });
        }
      });
    }

    // late section end here

    // monthcross section start from here

    const rent_transact_response_monthcross =
      await prisma.rent_transact.updateMany({
        where: {
          NOT: [{ status: "PAID" }],
          formonth: {
            lte: new_date_p30,
          },
        },
        data: {
          status: "MONTHCROSS",
        },
      });

    const get_monthcross_rent = await prisma.rent_transact.findMany({
      where: {
        status: "MONTHCROSS",
        NOT: [{ status: "PAID" }],
        formonth: {
          lte: new_date_p30,
        },
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

    if (get_monthcross_rent.length > 0) {
      get_monthcross_rent.map(async (rent) => {
        const get_rent_sms = await prisma.rent_sms.findFirst({
          where: {
            rentId: rent.rentId,
            userId: rent.userId,
            rentTransactId: rent.id,
          },
        });

        if (get_rent_sms && get_rent_sms.monthcross != "SENT") {
          const response = await send_monthcross_rent_sms({
            contact: rent.user.contactone!,
            propertyName: rent.shop.property.name,
            shopCategory: rent.shop.shop_category.name,
          });
          if (!response.status) {
            return {
              status: false,
              data: null,
              message: response.message,
              functionname: "UpdateRentTrasact",
            };
          }

          const update_rent_sms = await prisma.rent_sms.update({
            where: {
              id: get_rent_sms.id,
            },
            data: {
              monthcross: "SENT",
            },
          });
        }
      });
    }

    // monthcross section end here

    if (
      !rent_transact_response_due ||
      !rent_transact_response_late ||
      !rent_transact_response_monthcross
    )
      return {
        status: false,
        data: null,
        message: "No Rent Transact Data Found for This User. Please try again.",
        functionname: "UpdateRentTrasact",
      };

    return {
      status: true,
      data: null,
      message: "Rent Transact data get successfully",
      functionname: "UpdateRentTrasact",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "UpdateRentTrasact",
    };
    return response;
  }
};

export default UpdateRentTrasact;

interface SendSmsPayload {
  contact: string;
  propertyName?: string;
  shopCategory?: string;
}

const sent_due_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20due.%20Please%20ensure%20prompt%20payment%20through%20the%20portal.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};

const send_late_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20now%20past%20due%20for%20the%20previous%20month.%20Urgent%20action%20is%20required.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};

const send_monthcross_rent_sms = async (payload: SendSmsPayload) => {
  try {
    const messagebody = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${payload.shopCategory}%20at%20${payload.propertyName}%20is%20now%20overdue.%20Kindly%20settle%20the%20outstanding%20amount%20promptly%20through%20the%20portal%20-DNH%20PDA.&MobileNumbers=91${payload.contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const response = await axios.get(messagebody);
    if (response.data.Data[0].MessageErrorDescription == "Success") {
      return {
        status: true,
        data: true,
        message: "SMS sent successfully",
        functionname: "sendSMS",
      };
    } else {
      return {
        status: false,
        data: null,
        message: "Unable to send SMS",
        functionname: "sendSMS",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: null,
      message: errorToString(error),
      functionname: "sendSMS",
    };
  }
};

function getAlgorithm(keyBase64: string) {
  var key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
    default:
      return "aes-256-cbc";
  }
  // throw new Error("Invalid key length: " + key.length);
}

// const encrypt = (plainText: string, keyBase64: string, ivBase64: string) => {
//   const key = Buffer.from(keyBase64, "base64");
//   const iv = Buffer.from(ivBase64, "base64");

//   const cipher = crypto.createCipheriv(
//     getAlgorithm(keyBase64),
//     new Uint8Array(key),
//     new Uint8Array(iv)
//   );
//   let encrypted = cipher.update(plainText, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// };

// const decrypt = (
//   messagebase64: string,
//   keyBase64: string,
//   ivBase64: string
// ) => {
//   const key = Buffer.from(keyBase64, "base64");
//   const iv = Buffer.from(ivBase64, "base64");

//   const decipher = crypto.createDecipheriv(
//     getAlgorithm(keyBase64),
//     new Uint8Array(key),
//     new Uint8Array(iv)
//   );

//   let decrypted = decipher.update(messagebase64, "hex");
//   decrypted += decipher.final();
//   return decrypted;
// };

// const checkpaymentstatus = async () => {
//   var workingKey = "370F518A36775EFEA425EB27C8DC0CC6", //Put in the 32-Bit key shared by CCAvenues.
//     accessCode = "AVHK88LE92BW69KHWB", //Put in the Access Code shared by CCAvenues.
//     encRequest = "";

//   //Generate Md5 hash for the key and then convert in base64 string
//   var md5: Buffer = crypto.createHash("md5").update(workingKey).digest();
//   var keyBase64 = md5.toString("base64");

//   //Initializing Vector and then convert in base64 string
//   var ivBase64: string = Buffer.from([
//     0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//     0x0c, 0x0d, 0x0e, 0x0f,
//   ]).toString("base64");

//   // const datatosend = {
//   //   reference_no: "419311038953",
//   // };

//   const pending_rent = await prisma.rent_transact.findMany({
//     where: {
//       deletedAt: null,
//       deletedBy: null,
//       orderid: {
//         not: null,
//       },
//       trackid: null,
//     },
//   });

//   if (pending_rent.length > 0) {
//     for (let i = 0; i < pending_rent.length; i++) {
//       encRequest = encrypt(
//         `{order_no:'${pending_rent[i].orderid}'}`,
//         keyBase64,
//         ivBase64
//       );

//       const result = await axios.post(
//         `https://api.ccavenue.com/apis/servlet/DoWebTrans?access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&response_type=JSON&version=1.2&enc_request=${encRequest}`
//       );

//       let enc_code = result.data.toString().split("=").pop();

//       let ccavResponse = decrypt(enc_code, keyBase64, ivBase64);

//       let obj = JSON.parse(ccavResponse);

//       if (obj["status"] == 0) {
//         if (
//           obj["order_status"] == "Success" ||
//           obj["order_status"] == "Shipped"
//         ) {
//           const gstnumber = await prisma.gstinvoice.findFirst({
//             orderBy: { id: "desc" },
//           });

//           await prisma.gstinvoice.create({
//             data: {
//               number: gstnumber?.number + 1,
//             },
//           });



//           await prisma.rent_transact.update({
//             where: {
//               id: pending_rent[i].id,
//             },
//             data: {
//               gstinvoice: gstnumber.number,
//               transactionid: obj["order_bank_ref_no"],
//               trackid: obj["reference_no"],
//               status: "PAID",
//               transaction_date: new Date().toISOString(),
//               paymentmode: obj["order_card_name"].toString().toUpperCase(),
//               remarks: "Success",
//             },
//           });
//         } else if (
//           obj["order_status"] == "Awaited" ||
//           obj["order_status"] == "Initiated "
//         ) {
//         } else {
//           await prisma.rent_transact.update({
//             where: {
//               id: pending_rent[i].id,
//             },
//             data: {
//               orderid: null,
//               transaction_date: new Date().toISOString(),
//             },
//           });
//         }

//         // end
//       }
//     }
//   }

//   const pending_payment = await prisma.bid_payment.findMany({
//     where: {
//       deletedAt: null,
//       deletedBy: null,
//       orderid: {
//         not: null,
//       },
//       trackid: null,
//     },
//   });

//   if (pending_payment.length > 0) {
//     for (let i = 0; i < pending_payment.length; i++) {
//       encRequest = encrypt(
//         `{order_no:'${pending_payment[i].orderid}'}`,
//         keyBase64,
//         ivBase64
//       );

//       const result = await axios.post(
//         `https://api.ccavenue.com/apis/servlet/DoWebTrans?access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&response_type=JSON&version=1.2&enc_request=${encRequest}`
//       );

//       let enc_code = result.data.toString().split("=").pop();

//       let ccavResponse = decrypt(enc_code, keyBase64, ivBase64);

//       let obj = JSON.parse(ccavResponse);

//       if (obj["status"] == 0) {
//         if (
//           obj["order_status"] == "Success" ||
//           obj["order_status"] == "Shipped"
//         ) {
//           updatedata = await prisma.bid_payment.update({
//             where: {
//               id: pending_payment[i].id,
//             },
//             data: {
//               deletedAt: null,
//               transactionid: obj["order_bank_ref_no"],
//               trackid: obj["reference_no"],
//               status: "PAID",
//               transaction_date: new Date().toISOString(),
//               paymentmode: obj["order_card_name"].toString().toUpperCase(),
//               remarks: "Success",
//             },
//           });
//         } else if (
//           obj["order_status"] == "Awaited" ||
//           obj["order_status"] == "Initiated "
//         ) {
//         } else {
//           updatedata = await prisma.bid_payment.update({
//             where: {
//               id: pending_payment[i].id,
//             },
//             data: {
//               orderid: null,
//               transaction_date: new Date().toISOString(),
//             },
//           });
//         }

//         // end
//       }
//     }
//   }
// };
