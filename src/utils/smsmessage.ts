import { ApiResponseType } from "@/models/response";
import axios from "axios";
import { toast } from "react-toastify";
import { errorToString } from "./methods";
import { Agent } from "http";

export enum SMSType {
  NewBidSubmitted,
  HigherBidSubmitted,
  BidAccepted,
  DocumentShortfall,
  BidRejected,
  BidIsNowOpen,
  RentIsDue,
  RentIsLate,
  RentIsOverdue,
  RentIsStarted,
  RentIsPaid,
}

interface SendSms {
  contact: string;
  propertyName?: string;
  shopCategory?: string;
  type: SMSType;
}

export const sendSMS = async (
  args: SendSms
): Promise<ApiResponseType<boolean | null>> => {
  try {
    const { contact, propertyName, shopCategory } = args;

    if (!contact) {
      return {
        status: false,
        data: null,
        message: "Contact number is required",
        functionname: "sendSMS",
      };
    }

    if (
      args.type === SMSType.HigherBidSubmitted ||
      args.type === SMSType.BidAccepted ||
      args.type === SMSType.DocumentShortfall ||
      args.type === SMSType.BidRejected ||
      args.type === SMSType.BidIsNowOpen
    ) {
      if (!propertyName) {
        return {
          status: false,
          data: null,
          message: "Property name is required",
          functionname: "sendSMS",
        };
      }
    }

    if (
      args.type === SMSType.RentIsDue ||
      args.type === SMSType.RentIsLate ||
      args.type === SMSType.RentIsOverdue ||
      args.type === SMSType.RentIsStarted ||
      args.type === SMSType.RentIsPaid
    ) {
      if (!propertyName) {
        return {
          status: false,
          data: null,
          message: "Property name is required",
          functionname: "sendSMS",
        };
      }

      if (!shopCategory) {
        return {
          status: false,
          data: null,
          message: "Shop category is required",
          functionname: "sendSMS",
        };
      }
    }

    const NewBidSubmitted = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Thank%20you%20for%20submitting%20your%20bid.%20We%20have%20received%20it%20successfully.%20You%20will%20be%20notified%20of%20any%20updates%20or%20further%20actions.%20-%20PDA%2C%20DNH.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const HigherBidSubmitted = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=A%20higher%20bid%20has%20been%20submitted%20by%20another%20bidder%20at%20${propertyName}.%20Please%20visit%20the%20portal%20to%20enter%20a%20higher%20bid-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const BidAccepted = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Your%20bid%20has%20been%20accepted%20for%20the%20property%20at%20${propertyName}.%20Please%20wait%20for%20the%20result.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const DocumentShortfall = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Submitted%20documents%20for%20the%20property%20at%20${propertyName}%20are%20incomplete.%20Kindly%20upload%20all%20documents%20on%20the%20portal.%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const BidRejected = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Your%20bid%20for%20shop%20at%20${propertyName}%20has%20been%20rejected.%20We%20appreciate%20your%20participation%20and%20encourage%20you%20for%20upcoming%20opportunities.%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const BidIsNowOpen = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20bid%20for%20the%20property%20at%20${propertyName}%20is%20now%20open.%20You%20can%20submit%20your%20bid%20through%20the%20portal.%20Best%20of%20luck%21%20-DNH%20PDA&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const RentIsDue = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Rent%20payment%20for%20${shopCategory}%20at%20${propertyName}%20is%20due.%20Please%20ensure%20prompt%20payment%20through%20the%20portal.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const RentIsLate = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${shopCategory}%20at%20${propertyName}%20is%20now%20past%20due%20for%20the%20previous%20month.%20Urgent%20action%20is%20required.%20Thank%20you.%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const RentIsOverdue = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20payment%20for%20${shopCategory}%20at%20${propertyName}%20is%20now%20overdue.%20Kindly%20settle%20the%20outstanding%20amount%20promptly%20through%20the%20portal%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const RentIsStarted = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=The%20rent%20for%20${shopCategory}%20at%20${propertyName}%20has%20commenced.%20Kindly%20ensure%20timely%20payments%20through%20the%20portal.%20Thank%20you%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const RentIsPaid = `https://api.arihantsms.com/api/v2/SendSMS?SenderId=DNHPDA&Is_Unicode=false&Is_Flash=false&Message=Confirmation%3A%20Your%20rent%20for%20${shopCategory}%20at%20${propertyName}%20has%20been%20paid.%20We%20appreciate%20your%20timely%20payment%20-DNH%20PDA.&MobileNumbers=91${contact}&ApiKey=rL56LBkGeOa1MKFm5SrSKtz%2Bq55zMVdxk5PNvQkg2nY%3D&ClientId=ebff4d6c-072b-4342-b71f-dcca677713f8`;

    const getmessage = (): string => {
      switch (args.type) {
        case SMSType.NewBidSubmitted:
          return NewBidSubmitted;
        case SMSType.HigherBidSubmitted:
          return HigherBidSubmitted;
        case SMSType.BidAccepted:
          return BidAccepted;
        case SMSType.DocumentShortfall:
          return DocumentShortfall;
        case SMSType.BidRejected:
          return BidRejected;
        case SMSType.BidIsNowOpen:
          return BidIsNowOpen;
        case SMSType.RentIsDue:
          return RentIsDue;
        case SMSType.RentIsLate:
          return RentIsLate;
        case SMSType.RentIsOverdue:
          return RentIsOverdue;
        case SMSType.RentIsStarted:
          return RentIsStarted;
        case SMSType.RentIsPaid:
          return RentIsPaid;
        default:
          return NewBidSubmitted;
      }
    };

    const messagebody = getmessage();


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
