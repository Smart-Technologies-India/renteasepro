"use client";
import { ToWords } from "to-words";

import GetBid from "@/action/bid/getbid";
import GetFromUserBid from "@/action/bidpayment/getfromuserbid";
import GetUser from "@/action/user/getuser";
import { capitalcase, formatDateTime, formateDate } from "@/utils/methods";
import { bid_payment, user } from "@prisma/client";
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

interface ViewPdfProps {
  userid: number;
  bidid: number;
}

const ViewPdf = (props: ViewPdfProps) => {
  const toWords = new ToWords();

  const [bid, setBid] = useState<any>();
  const [user, setUser] = useState<user>();
  const [payment, setPayment] = useState<bid_payment>();

  useEffect(() => {
    const init = async () => {
      const bidresponse = await GetBid({ id: props.bidid });

      if (bidresponse.status) {
        setBid(bidresponse.data);
      }

      const userresponse = await GetUser({ id: props.userid });
      if (userresponse.status) {
        setUser(userresponse.data!);
      }

      const bidpaymentresponse = await GetFromUserBid({
        bidid: props.bidid,
        userid: props.userid,
      });

      console.log(bidpaymentresponse);
      if (bidpaymentresponse.status) {
        setPayment(bidpaymentresponse.data!);
      }
    };

    init();
  }, [props.bidid, props.userid]);
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
              Invoice - Cum - Receipt
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
            {bid?.shop.property.name}
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
            {formateDate(new Date(bid?.createdAt))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Shop Number</Text>
          <Text style={styles.mbottom}>{bid?.shop.shopNumber}</Text>
          <Text style={styles.rbottom}>Invoice No.</Text>
          <Text style={styles.mbottom2}>
            BID /{bid?.id ?? "-"}/
            {new Date(bid?.createdAt).getFullYear().toString().slice(2)}-
            {(new Date(bid?.createdAt).getFullYear() + 1).toString().slice(2)}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Name</Text>
          <Text style={styles.mbottom}>
            {user?.firstName} {user?.lastName} [{user?.contactone!}]
          </Text>
          <Text style={styles.rbottom}>Start Date</Text>
          <Text style={styles.mbottom2}>
            {formateDate(new Date(bid?.bidstartdate))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Submit Date</Text>
          <Text style={styles.mbottom}>
            {formatDateTime(new Date(payment?.createdAt!))}
          </Text>
          <Text style={styles.rbottom}>End Date</Text>
          <Text style={styles.mbottom2}>
            {formateDate(new Date(bid?.bidenddate))}
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
          <Text style={styles.rtop}>Amount</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>1</Text>
          <Text style={styles.mbottom}>Fees Amount</Text>
          <Text style={styles.rbottom}>{bid?.fees_amount}</Text>
        </View>

        {bid?.emd_amount && (
          <View style={styles.myflex}>
            <Text style={styles.lbottom}>2</Text>
            <Text style={styles.mbottom}>EMD Amount</Text>
            <Text style={styles.rbottom}>{bid?.emd_amount}</Text>
          </View>
        )}
        {bid?.bg_amount && (
          <View style={styles.myflex}>
            <Text style={styles.lbottom}>3</Text>
            <Text style={styles.mbottom}>BG Amount</Text>
            <Text style={styles.rbottom}>{bid?.bg_amount}</Text>
          </View>
        )}

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
            {parseFloat(bid?.fees_amount ?? "0") +
              parseFloat(bid?.emd_amount ?? "0") +
              parseFloat(bid?.bg_amount ?? "0")}
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
                  (
                    parseFloat(bid?.fees_amount ?? "0") +
                    parseFloat(bid?.emd_amount ?? "0") +
                    parseFloat(bid?.bg_amount ?? "0")
                  ).toString()
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
            {parseFloat(bid?.fees_amount ?? "0") +
              parseFloat(bid?.emd_amount ?? "0") +
              parseFloat(bid?.bg_amount ?? "0")}
            (
            {capitalcase(
              toWords.convert(
                parseInt(
                  (
                    parseFloat(bid?.fees_amount ?? "0") +
                    parseFloat(bid?.emd_amount ?? "0") +
                    parseFloat(bid?.bg_amount ?? "0")
                  ).toString()
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
              margin: "2px 0",
            }}
          >
            1. Fees amount: {bid?.fees_amount}
          </Text>
          {bid?.emd_amount && (
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                margin: "2px 0",
              }}
            >
              2. EMD amount: {bid?.emd_amount}
            </Text>
          )}
          {bid?.bg_amount && (
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                margin: "2px 0",
              }}
            >
              3. BG amount: {bid?.bg_amount}
            </Text>
          )}

          <Text
            style={{
              fontSize: 10,
              color: "grey",
              margin: "2px 0",
            }}
          >
            In the form of {payment?.paymentmode} vide Reference No.{" "}
            {payment?.transactionid} dated{" "}
            {formateDate(new Date(payment?.transaction_date!))}
          </Text>
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
                {parseFloat(bid?.fees_amount ?? "0") +
                  parseFloat(bid?.emd_amount ?? "0") +
                  parseFloat(bid?.bg_amount ?? "0")}
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
