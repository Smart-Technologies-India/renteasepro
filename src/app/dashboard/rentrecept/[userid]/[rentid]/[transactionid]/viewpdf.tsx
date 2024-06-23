"use client";

import GetRent from "@/action/rent/getrent";
import GetRentRecept from "@/action/rentrecept/getrentrecept";
import GetUser from "@/action/user/getuser";
import { capitalcase, formateDate } from "@/utils/methods";
import { ToWords } from "to-words";

import { user } from "@prisma/client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
  renderToFile,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ViewPdfProps {
  userid: number;
  rentid: number;
  transactionid: string;
}

const ViewPdf = (props: ViewPdfProps) => {
  const toWords = new ToWords();

  const router = useRouter();

  const [rent, setRent] = useState<any>();
  const [user, setUser] = useState<user>();
  const [history, setHistory] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      const rentresponse = await GetRent({ id: props.rentid });

      if (rentresponse.status) {
        setRent(rentresponse.data);
      }

      const userresponse = await GetUser({ id: props.userid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const historyresponse = await GetRentRecept({
        rentid: props.rentid,
        userid: props.userid,
        transactionid: props.transactionid,
      });

      if (historyresponse.status) {
        setHistory(historyresponse.data);

        console.log(historyresponse.data);
      }
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

  const Quixote = () => (
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
            {rent?.shop.property.name}
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
            {formateDate(new Date(history[0]?.transaction_date))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Shop Number</Text>
          <Text style={styles.mbottom}>{rent?.shop.shopNumber}</Text>
          <Text style={styles.rbottom}>Invoice No.</Text>
          <Text style={styles.mbottom2}>
            PDA /{history[0].gstinvoice ?? "-"}/
            {new Date(rent?.createdAt).getFullYear().toString().slice(2)}-
            {(new Date(rent?.createdAt).getFullYear() + 1).toString().slice(2)}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Name</Text>
          <Text style={styles.mbottom}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.rbottom}>Start Date</Text>
          <Text style={styles.mbottom2}>
            {formateDate(new Date(rent?.rent_start_date))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Mobile</Text>
          <Text style={styles.mbottom}>{user?.contactone!}</Text>
          <Text style={styles.rbottom}>End Date</Text>
          <Text style={styles.mbottom2}>
            {formateDate(new Date(rent?.rent_end_date))}
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
            {history
              .flatMap(
                (arr: any) =>
                  [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ][new Date(arr.formonth).getMonth()] +
                  "-" +
                  (new Date(arr.formonth).getFullYear() % 100)
              )
              .join(", ")}
          </Text>
          <Text style={styles.rbottom2}>997212</Text>
          <Text style={styles.rbottom}>
            {(
              history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) -
              (history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
                118
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
            CGST
          </Text>
          <Text style={styles.rbottom2}></Text>
          <Text style={styles.rbottom}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
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
            IGST
          </Text>
          <Text style={styles.rbottom2}></Text>
          <Text style={styles.rbottom}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
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
            {history
              .flatMap((arr: any) => arr.amount)
              .reduce((acc: any, curr: any) => acc + curr, 0)}
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
                parseInt(
                  history
                    .flatMap((arr: any) => arr.amount)
                    .reduce((acc: any, curr: any) => acc + curr, 0)
                )
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
              history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) -
              (history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
                118
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118
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
              history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) -
              (history
                .flatMap((arr: any) => arr.amount)
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
                118
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>9%</Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118 /
              2
            ).toFixed(2)}
          </Text>
          <Text style={styles.ltop2}>
            {(
              (history
                .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                .reduce((acc: any, curr: any) => acc + curr, 0) *
                18) /
              118
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
                    (history
                      .flatMap((arr: any) => arr.amount)
                      .reduce((acc: any, curr: any) => acc + curr, 0) *
                      18) /
                    118
                  ).toString()
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
            {history
              .flatMap((arr: any) => arr.amount)
              .reduce((acc: any, curr: any) => acc + curr, 0)}
            (
            {capitalcase(
              toWords.convert(
                parseInt(
                  history
                    .flatMap((arr: any) => arr.amount)
                    .reduce((acc: any, curr: any) => acc + curr, 0)
                    .toString()
                )
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
            1. Rent for month{" "}
            {history
              .flatMap(
                (arr: any) =>
                  [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ][new Date(arr.formonth).getMonth()] +
                  "-" +
                  (new Date(arr.formonth).getFullYear() % 100)
              )
              .join(", ")}
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
            {formateDate(new Date(history[0]?.transaction_date))}
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
                {history
                  .flatMap((arr: any) => arr.amount)
                  .reduce((acc: any, curr: any) => acc + curr, 0)}
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
      </Page>
    </Document>
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const init = async () => {
      const file = await pdf(<Quixote />).toBlob();
      const mypdffile: File = new File([file], "data");
    };
    init();
  }, []);

  const getfile = async () => {
    const file: NodeJS.ReadableStream = await renderToFile(
      <Quixote />,
      "test",
      (output, filePath) => {
        // Optional callback logic
      }
    );
  };

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
      {isClient ? (
        <div className="w-full h-full">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Quixote />
          </PDFViewer>
        </div>
      ) : null}
    </>
  );
};

export default ViewPdf;
