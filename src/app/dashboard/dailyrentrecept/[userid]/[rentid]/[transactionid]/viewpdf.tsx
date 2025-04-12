"use client";

import GetUser from "@/action/user/getuser";
import { capitalcase, formateDate } from "@/utils/methods";
import { ToWords } from "to-words";

import {
  daily_property,
  daily_rent,
  daily_rent_transact,
  daily_shop,
  user,
} from "@prisma/client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  usePDF,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import GetDailyRentRecept from "@/action/dailyrentrecept/getdailyrentrecept";
import GetDailyRentById from "@/action/dailyrent/getdailyrentbyid";
import { toDate } from "date-fns";

interface ViewPdfProps {
  userid: number;
  rentid: number;
  transactionid: string;
}

const ViewPdf = (props: ViewPdfProps) => {
  const [isloading, setIsloading] = useState(false);

  const toWords = new ToWords();
  const router = useRouter();

  const [rent, setRent] = useState<
    | (daily_rent & { daily_shop: daily_shop & { property: daily_property } })
    | null
  >(null);
  const [user, setUser] = useState<user>();
  const [history, setHistory] = useState<
    Array<
      daily_rent_transact & {
        user: user;
        daily_rent: daily_rent;
        daily_shop: daily_shop & { property: daily_property };
      }
    >
  >([]);

  const [invoicenumber, setInvoiceNumber] = useState<string>("0");

  useEffect(() => {
    const init = async () => {
      setIsloading(true);
      const rentresponse = await GetDailyRentById({ id: props.rentid });
      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      const userresponse = await GetUser({ id: props.userid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const historyresponse = await GetDailyRentRecept({
        rentid: props.rentid,
        userid: props.userid,
        transactionid: props.transactionid,
      });

      if (historyresponse.status && historyresponse.data) {
        setHistory(historyresponse.data);

        if (historyresponse.data![0].gstinvoice) {
          setInvoiceNumber(historyresponse.data![0].gstinvoice!.toString());
        }
      }
      setIsloading(false);
    };

    init();
  }, [props.rentid, props.userid, props.transactionid]);
  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 20,
      paddingBottom: 25,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 20,
      lineHeight: 1,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    subtitle: {
      fontSize: 10,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    titledescription: {
      fontSize: 12,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: "16px",
      color: "#1f2937",
      textAlign: "center",
      fontWeight: "normal",
      textDecoration: "underline",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },

    ltop: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "80px",
      padding: "4px 4px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },

    ltop2: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      // borderLeft: "1px solid #6b7280",
      textAlign: "center",
    },

    lbottom: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "80px",
      padding: "4px 4px",
      textAlign: "center",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
    },

    mtop: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 4px",
      // border: "1px solid #6b7280",
      textAlign: "center",
      borderTop: "1px solid #6b7280",
      borderBottom: "1px solid #6b7280",
    },

    mbottom: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      // borderRight: "1px solid #6b7280",
      // borderLeft: "1px solid #6b7280",
    },
    mtop2: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 4px",
      // border: "1px solid #6b7280",
      textAlign: "center",
      borderTop: "1px solid #6b7280",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
    },

    mbottom2: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
    },

    rtop: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 4px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },
    rtop2: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      borderTop: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
      width: "60px",
      textAlign: "center",
    },

    rbottom: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
    },
    rbottom2: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 4px",
      borderBottom: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
    },

    divider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#6b7280",
      marginVertical: "2px",
    },
    flexbox: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginTop: "55px",
    },
    flexbox1: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 4,
    },
    flexbox2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
    },
    imagebox: {
      position: "absolute",
      display: "flex",
      width: "100vw",
      top: "40px",
      alignItems: "center",
    },
    image: {
      marginTop: "200px",
      width: "80%",
      opacity: 0.1,
    },
  });

  // const getDate = (from_date: Date, to_date: Date): string => {
  //   // if date is same then return "on {that day}"
  //   // if date is not same then return "from {start_date} to {end_date}"

  //   if (from_date === to_date) {
  //     return ` on ${formateDate(from_date)}`;
  //   }

  //   return ` from ${formateDate(from_date)} to ${formateDate(to_date)}`;
  // };

  function getFinancialYear(transactionDate: string): string {
    const [day, month, year] = transactionDate.split("-").map(Number);

    // If the month is before April, it belongs to the previous financial year
    const startYear = month < 4 ? year - 1 : year;
    const endYear = startYear + 1;

    return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
  }

  const Quixote = (
    <Document>
      <Page style={styles.body} size={"A4"} wrap>
        <View style={styles.imagebox}>
          <Image src="/dnhpda_logo.png" style={styles.image} />
        </View>

        <View>
          <Text style={styles.subtitle}>Form 2</Text>
          <Text style={styles.subtitle}>(Rule 11)</Text>
          <Text style={styles.title}>Dadra and Nagar Haveli</Text>
          <Text style={styles.title}>Planning and development Authority</Text>
          <View
            style={{
              height: "10px",
            }}
          ></View>
          <Text style={styles.titledescription}>
            &quot;A&quot; WING, Second Floor, District Secretariat,
            Silvassa-396230.
          </Text>
          <Text style={styles.titledescription}>
            GSTIN/UIN: 26AAALD0940J1ZE
          </Text>
        </View>

        <View
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center",
                fontWeight: "normal",
                textDecoration: "underline",
              }}
            >
              Tax Invoice - Cum - Receipt
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: "10px",
          }}
        ></View>

        <View style={styles.myflex}>
          <Text style={styles.ltop}>Property Name</Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "left",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
            }}
          >
            {rent?.daily_shop.property.name}
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 1,
              padding: "4px 4px",
              border: "1px solid #6b7280",
              textAlign: "left",
            }}
          >
            Date
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "left",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            {formateDate(new Date(history[0]?.transaction_date!))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Unit name</Text>
          <Text style={styles.mbottom}>{rent?.daily_shop.name}</Text>
          <Text style={styles.rbottom}>Invoice No.</Text>
          <Text style={styles.mbottom2}>
            PDA /{(invoicenumber ?? "0").toString().padStart(4, "0")}/
            {getFinancialYear(history[0]?.transaction_date.toDateString())}
            {/* {new Date(history[0]?.transaction_date)
              .getFullYear()
              .toString()
              .slice(2)}
            -
            {(new Date(history[0]?.transaction_date).getFullYear() + 1)
              .toString()
              .slice(2)} */}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Name</Text>
          <Text style={styles.mbottom}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.rbottom}>Start Date</Text>
          <Text style={styles.mbottom2}>
            {/* {formateDate(new Date(rent?.event_from_date!))} */}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Mobile</Text>
          <Text style={styles.mbottom}>{user?.contactone!}</Text>
          <Text style={styles.rbottom}>End Date</Text>
          <Text style={styles.mbottom2}>
            {/* {formateDate(new Date(rent?.event_to_date!))} */}
          </Text>
        </View>

        <View
          style={{
            marginTop: "5px",
          }}
        ></View>

        <View style={styles.myflex}>
          <Text style={styles.ltop}>Sr. No</Text>
          <Text style={styles.mtop}>Rent For Months</Text>
          <Text style={styles.rtop2}>HSN</Text>
          <Text style={styles.rtop}>Amount</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>1</Text>
          <Text style={styles.mbottom}>
            Rent of Goverment Buildings
            {"\n"}
            <Text
              style={{
                fontSize: "8px",
                color: "#000",
              }}
            >
              Booking of {rent?.daily_shop.name} at{" "}
              {rent?.daily_shop.property.name}{" "}
              {/* {rent?.event_from_date == rent?.event_to_date
                ? ` on ${formateDate(rent?.event_from_date!)}`
                : `from ${formateDate(
                    rent?.event_from_date!
                  )}} to ${formateDate(rent?.event_to_date!)}`}{" "} */}
              for {rent?.event_reason}
            </Text>
          </Text>
          <Text style={styles.rbottom2}>997212</Text>
          <Text style={styles.rbottom}>
            {((parseInt(rent?.event_amount ?? "0") / 118) * 100).toFixed(2)}
            {/* {(
              history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) -
              (history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
                118
            ).toFixed(2)} */}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>2</Text>
          <Text style={styles.mbottom}>Pre-Preparation Day Charges</Text>
          <Text style={styles.rbottom2}>997212</Text>
          <Text style={styles.rbottom}>
            {((parseInt(rent?.prep_day_amount ?? "0") / 118) * 100).toFixed(2)}
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>3</Text>
          <Text style={styles.mbottom}>Handover Day Charges</Text>
          <Text style={styles.rbottom2}>997212</Text>

          <Text style={styles.rbottom}>
            {((parseInt(rent?.handover_day_amount ?? "0") / 118) * 100).toFixed(
              2
            )}
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>4</Text>
          <Text style={styles.mbottom}>Deposit Amount</Text>
          <Text style={styles.rbottom2}></Text>
          <Text style={styles.rbottom}>{rent?.deposit_amount}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}></Text>
          <Text
            style={{
              textAlign: "right",
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              borderBottom: "1px solid #6b7280",
            }}
          >
            CGST
          </Text>
          <Text style={styles.rbottom2}></Text>
          <Text style={styles.rbottom}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}></Text>
          <Text
            style={{
              textAlign: "right",
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              borderBottom: "1px solid #6b7280",
            }}
          >
            UTGST
          </Text>
          <Text style={styles.rbottom2}></Text>
          <Text style={styles.rbottom}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}></Text>
          <Text
            style={{
              textAlign: "right",
              fontSize: "10px",
              color: "#000",
              flex: 3,
              padding: "4px 4px",
              borderBottom: "1px solid #6b7280",
              fontFamily: "Oswald",
            }}
          >
            Total
          </Text>
          <Text style={styles.rbottom2}></Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 1,
              padding: "4px 4px",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              borderLeft: "1px solid #6b7280",
              fontFamily: "Oswald",
            }}
          >
            {(parseInt(rent?.event_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100 +
              parseInt(rent?.deposit_amount ?? "0") +
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                0.09 +
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                0.09}
          </Text>
        </View>
        <Text
          style={{
            fontSize: "10px",
            fontWeight: "normal",
            color: "#374151",
            width: "100%",
            padding: "4px 4px",
            borderLeft: "1px solid #6b7280",
            borderBottom: "1px solid #6b7280",
            borderRight: "1px solid #6b7280",
            textAlign: "left",
          }}
        >
          Amount Chargeable (in words) :{" "}
          {"Indian Rupees " +
            capitalcase(
              toWords.convert(
                (parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100 +
                  parseInt(rent?.deposit_amount ?? "0") +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09 +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09
              )
            ) +
            " Only"}
        </Text>

        <View
          style={{
            marginVertical: "5px",
          }}
        ></View>
        <View style={styles.myflex}>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "left",
              borderTop: "1px solid #6b7280",
              borderLeft: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            HSN/SAC
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              width: "60px",
              padding: "4px 4px",
              textAlign: "center",
              borderTop: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            Taxable
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              width: "120px",
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "center",
            }}
          >
            Central Tax
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              width: "120px",
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "center",
            }}
          >
            UT Tax
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              width: "60px",
              padding: "4px 4px",
              borderRight: "1px solid #6b7280",
              borderTop: "1px solid #6b7280",
              textAlign: "center",
            }}
          >
            Total Tax
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "left",
              borderBottom: "1px solid #6b7280",
              borderLeft: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          ></Text>
          <Text style={styles.ltop2}>Value</Text>
          <Text style={styles.ltop2}>Rate</Text>
          <Text style={styles.ltop2}>Amount</Text>
          <Text style={styles.ltop2}>Rate</Text>
          <Text style={styles.ltop2}>Amount</Text>
          <Text style={styles.ltop2}>Amount</Text>
        </View>
        <View style={styles.myflex}>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "left",
              borderBottom: "1px solid #6b7280",
              borderLeft: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            997212
          </Text>
          <Text style={styles.ltop2}>
            {(
              (parseInt(rent?.event_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09 *
              2
            ).toFixed(2)}
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 3,
              padding: "4px 4px",
              textAlign: "right",
              borderBottom: "1px solid #6b7280",
              borderLeft: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            Total
          </Text>
          <Text style={styles.ltop2}>
            {(
              (parseInt(rent?.event_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>
            {(
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
              0.09 *
              2
            ).toFixed(2)}
          </Text>
        </View>
        <Text
          style={{
            fontSize: "10px",
            fontWeight: "normal",
            color: "#374151",
            width: "100%",
            padding: "4px 4px",
            borderLeft: "1px solid #6b7280",
            borderBottom: "1px solid #6b7280",
            borderRight: "1px solid #6b7280",
            textAlign: "left",
          }}
        >
          Tax Amount Chargeable (in words) :{" "}
          {"Indian Rupees " +
            capitalcase(
              toWords.convert(
                parseInt(
                  (
                    ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                      (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                      (parseInt(rent?.handover_day_amount ?? "0") / 118) *
                        100) *
                    0.09 *
                    2
                  ).toFixed(2)
                )
              )
            ) +
            " Only"}
        </Text>
        <View
          style={{
            marginTop: "5px",
          }}
        ></View>

        <View>
          <Text
            style={{
              fontSize: 10,
              color: "grey",
              width: "100%",
            }}
          >
            Received with thanks from {user?.firstName} {user?.lastName}{" "}
            {user?.contactone && `[${user?.contactone}]`} a sum of Rs.{" "}
            {(parseInt(rent?.event_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
              (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100 +
              parseInt(rent?.deposit_amount ?? "0") +
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                0.09 +
              ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                0.09}
            (
            {capitalcase(
              toWords.convert(
                (parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100 +
                  parseInt(rent?.deposit_amount ?? "0") +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09 +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09
              )
            ) + " Only"}
            )
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "grey",
            }}
          >
            on account as below :-
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "grey",
              margin: "4px 0",
            }}
          >
            Rent of Goverment Buildings, Booking of {rent?.daily_shop.name} at{" "}
            {rent?.daily_shop.property.name}{" "}
            {/* {getDate(rent?.event_from_date!, rent?.event_to_date!)} for{" "} */}
            for {rent?.event_reason} purpose.
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "grey",
              margin: "4px 0",
            }}
          >
            In the form of {history[0]?.paymentmode ?? "-"} vide Reference No.{" "}
            {history[0]?.trackid ?? "-"} dated{" "}
            {formateDate(new Date(history[0]?.transaction_date!))}
          </Text>

          <View
            style={{
              marginTop: "5px",
            }}
          ></View>
        </View>

        <View
          style={{
            marginTop: "80px",
          }}
        ></View>

        <View
          fixed
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: "30px",
            left: "0px",
            width: "100%",
            margin: "0px 20px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              justifyContent: "flex-end",
              paddingBottom: "10px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Image
                src="/rupee.jpg"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              />
              <Text
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  color: "#374151",
                  padding: "5px 8px",
                  border: "1px solid #6b7280",
                  textAlign: "center",
                }}
              >
                {(parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                  (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100 +
                  parseInt(rent?.deposit_amount ?? "0") +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09 +
                  ((parseInt(rent?.event_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.prep_day_amount ?? "0") / 118) * 100 +
                    (parseInt(rent?.handover_day_amount ?? "0") / 118) * 100) *
                    0.09}
                /-
              </Text>
            </View>

            <Text
              style={{
                fontSize: "10px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Cheques/Draft subjects to realization
            </Text>
          </View>

          <View
            style={{
              flexGrow: 1,
            }}
          ></View>

          <View
            style={{
              textAlign: "center",
            }}
          >
            <View
              style={{
                height: "60px",
              }}
            ></View>

            <Text
              style={{
                fontSize: "10px",
                color: "#6b7280",
              }}
            >
              For Dadra and Nagar Haveli
            </Text>
            <Text
              style={{
                marginTop: "2px",
                fontSize: "10px",
                color: "#6b7280",
              }}
            >
              Planning and Development Authority
            </Text>
          </View>
        </View>
        <View
          fixed
          style={{
            position: "absolute",
            bottom: "2px",
            left: "0px",
            width: "100%",
            margin: "0px 20px",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: "8px",
              position: "absolute",
              width: "100%",
              bottom: "16px",
            }}
          >
            This is a computer generated invoice and does not require a
            signature.
          </Text>
        </View>
      </Page>
    </Document>
  );

  const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);

  //   // const init = async () => {
  //   //   const file = await pdf(<Quixote />).toBlob();
  //   //   const mypdffile: File = new File([file], "data");
  //   // };
  //   // init();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      updateInstance(Quixote);
    }, 3000);
  }, [Quixote]);

  // const getfile = async () => {
  //   const file: NodeJS.ReadableStream = await renderToFile(
  //     <Quixote />,
  //     "test",
  //     (output, filePath) => {
  //       // Optional callback logic
  //     }
  //   );
  // };

  const [instance, updateInstance] = usePDF({ document: Quixote });

  return (
    <>
      <div className="h-10 flex items-center px-4">
        <p>Tax Invoice - Cum - Receipt</p>
        <div className="grow"></div>
        <Button onClick={() => router.back()} className="h-6 text-sm">
          Close
        </Button>
      </div>
      {/* {isClient ? (
        <PDFDownloadLink document={<Quixote />} fileName="download.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      ) : null} */}
      {isClient && isloading == false ? (
        <div className="w-full h-full">
          {/* <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Quixote />
          </PDFViewer> */}
          <embed
            src={instance.url!}
            className="w-full h-full"
            type="application/pdf"
          />
        </div>
      ) : null}
    </>
  );
};

export default ViewPdf;
