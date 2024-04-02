"use client";

import GetRent from "@/action/rent/getrent";
import GetRentRecept from "@/action/rentrecept/getrentrecept";
import GetUser from "@/action/user/getuser";
import { formatDateTime, formateDate } from "@/utils/methods";
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

interface ViewPdfProps {
  userid: number;
  rentid: number;
  transactionid: string;
}

const ViewPdf = (props: ViewPdfProps) => {
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
      }

      console.log(historyresponse.data);
    };

    init();
  }, [props.rentid, props.userid, props.transactionid]);
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
            <Text style={styles.title}>Rent Acknowledgement</Text>
          </View>

          <View>
            <Text style={styles.header}>1. Rent Details</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1 Organization Name</Text>
            <Text style={styles.text2}>PDA DNH</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>2 Property Name</Text>
            <Text style={styles.text2}>{rent?.shop.property.name}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>3 Shop Number</Text>
            <Text style={styles.text2}>{rent?.shop.shopNumber}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>4 Rent Start Date & Time</Text>
            <Text style={styles.text2}>
              {formateDate(new Date(rent?.rent_start_date))}
            </Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>5 Rent End Date & Time</Text>
            <Text style={styles.text2}>
              {formateDate(new Date(rent?.rent_end_date))}
            </Text>
          </View>
          <View>
            <Text style={styles.header}>2. Tenant Details</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1 Bidder Name</Text>
            <Text style={styles.text2}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>2 Bidder Mobile</Text>
            <Text style={styles.text2}>{user?.contactone!}</Text>
          </View>
          <View>
            <Text style={styles.header}>3. Rent Payment Details</Text>
          </View>

          {history.length > 0 && (
            <>
              <View style={styles.myflex}>
                <Text style={styles.text1}>1 Months</Text>
                <Text style={styles.text2}>
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
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>2 Paid Rent Amount</Text>
                <Text style={styles.text2}>
                  {history
                    .flatMap((arr: any) => arr.amount) // Extract numbers from objects
                    .reduce((acc: any, curr: any) => acc + curr, 0)}
                </Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>3 Transaction Id</Text>
                <Text style={styles.text2}>{history[0]?.transactionid}</Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>4 Payment Mode</Text>
                <Text style={styles.text2}>{history[0]?.paymentmode}</Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>5 Bank Name</Text>
                <Text style={styles.text2}>{history[0]?.bankname}</Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>6 Transaction Date & Time</Text>
                <Text style={styles.text2}>
                  {formatDateTime(new Date(history[0]?.transaction_date!))}
                </Text>
              </View>
            </>
          )}

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
