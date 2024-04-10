"use client";

import GetBid from "@/action/bid/getbid";
import GetFromUserBid from "@/action/bidpayment/getfromuserbid";
import GetUser from "@/action/user/getuser";
import { formatDateTime } from "@/utils/methods";
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
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    subtitle: {
      marginTop: "10px",
      fontSize: 12,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    header: {
      paddingLeft: "10px",
      marginTop: "15px",
      marginBottom: "10px",
      backgroundColor: "#c1dafe88",
      paddingVertical: "8px",
      fontSize: "14px",
      color: "#1f2937",
      textAlign: "left",
      fontWeight: "normal",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid #6b7280",
    },
    text1: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
      padding: "4px 8px",
      //   backgroundColor: "#f6f7f8",
      borderRight: "1px solid #6b7280",
    },
    text2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
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
      top: "130px",
      alignItems: "center",
    },
    image: {
      width: "60%",
      opacity: 0.1,
    },
  });

  const Quixote = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View style={styles.imagebox}>
          <Image src="/tenders_logo.png" style={styles.image} />
        </View>

        <View>
          <View>
            <Text style={styles.title}>Bid Acknowledgement</Text>
          </View>

          <View>
            <Text style={styles.header}>1. Bid Details</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1 Organization Name</Text>
            <Text style={styles.text2}>PDA DNH</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>2 Tender Id</Text>
            <Text style={styles.text2}>{`${
              bid?.is_auction ? "AUCTION" : "TENDER"
            }_${new Date(payment?.transaction_date!).getFullYear()}_${
              bid?.id
            }`}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>3 Property Name</Text>
            <Text style={styles.text2}>{bid?.shop.property.name}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>4 Shop Number</Text>
            <Text style={styles.text2}>{bid?.shop.shopNumber}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>5 Bid Start Date & Time</Text>
            <Text style={styles.text2}>
              {formatDateTime(new Date(bid?.bidstartdate))}
            </Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>6 Bid End Date & Time</Text>
            <Text style={styles.text2}>
              {" "}
              {formatDateTime(new Date(bid?.bidenddate))}
            </Text>
          </View>
          <View>
            <Text style={styles.header}>2. Bidder Details</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1 Bidder Name</Text>
            <Text style={styles.text2}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>2 Bid Submitted Date & Time</Text>

            <Text style={styles.text2}>
              {formatDateTime(new Date(payment?.createdAt!))}
            </Text>
          </View>
          <View>
            <Text style={styles.header}>3. Fees & EMD Details</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1 Fees Amount</Text>
            <Text style={styles.text2}>{bid?.fees_amount}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>2 EMD Amount</Text>
            <Text style={styles.text2}>{bid?.emd_amount}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>3 Transaction Id</Text>
            <Text style={styles.text2}>{payment?.transactionid}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>4 Payment Mode</Text>
            <Text style={styles.text2}>{payment?.paymentmode}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>5 Bank Name</Text>
            <Text style={styles.text2}>{payment?.bankname}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>6 Transaction Date & Time</Text>
            <Text style={styles.text2}>
              {formatDateTime(new Date(payment?.transaction_date!))}
            </Text>
          </View>

          <View
            style={{
              height: "40px",
            }}
          ></View>

          <View>
            <Text style={styles.subtitle} fixed>
              This is a computer generated document and does not require any
              signature.
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
