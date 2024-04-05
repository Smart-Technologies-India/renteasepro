"use client";

import GetBid from "@/action/bid/getbid";
import GetFromBidId from "@/action/bid_transact/getfrombidid";
import { formatDateTime, formateDate } from "@/utils/methods";
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
  id: number;
}

const ViewPdf = (props: ViewPdfProps) => {
  const [bid, setBid] = useState<any>();
  const [bidderList, setBidderList] = useState<any>([]);

  const [winnder, setWinnder] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const bidresponse = await GetBid({ id: props.id });

      if (bidresponse.status) {
        setBid(bidresponse.data);
      }

      const bidderresponse = await GetFromBidId({ id: props.id });
      if (bidderresponse.status) {
        setBidderList(bidderresponse.data);
      }

      console.log(bidderresponse.data);

      // get winnder of the bid and set the winnder

      const winnderdata = bidderresponse.data?.filter(
        (value: any) => value.status == "WINNINGBID"
      );

      console.log(winnderdata);
      if (winnderdata && winnderdata.length > 0) {
        setWinnder(winnderdata[0]);
        console.log(winnderdata[0]);
      }
    };

    init();
  }, [props.id]);
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
            <Text style={styles.text2}>{bid?.shop.property.name}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>3 Shop Number</Text>
            <Text style={styles.text2}>{bid?.shop.shopNumber}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>4 Bid Title</Text>
            <Text style={styles.text2}>{bid?.title}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>5 Bid Description</Text>
            <Text style={styles.text2}>{bid?.description ?? "-"}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>6 Bid Instructions</Text>
            <Text style={styles.text2}>{bid?.instruction ?? "-"}</Text>
          </View>

          {/* second section start from here */}

          <View style={styles.myflex}>
            <Text style={styles.text1}>7 Bid Start Date Time</Text>
            <Text style={styles.text2}>
              {formatDateTime(new Date(bid?.bidstartdate))}
            </Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>8 Bid End Date Time</Text>
            <Text style={styles.text2}>
              {formatDateTime(new Date(bid?.bidenddate))}
            </Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>9 Bid Deadline Date</Text>
            <Text style={styles.text2}>
              {formateDate(new Date(bid?.biddeclarationdate))}
            </Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>10 Fees Amount</Text>
            <Text style={styles.text2}>{bid?.fees_amount ?? "0"}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>11 Emd Amount</Text>
            <Text style={styles.text2}>{bid?.emd_amount ?? "0"}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>12 Bg Amount</Text>
            <Text style={styles.text2}>{bid?.bg_amount ?? "0"}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>13 Minimum Bid</Text>
            <Text style={styles.text2}>{bid?.min_bid_amount ?? "0"}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>14 Current Bid</Text>
            <Text style={styles.text2}>
              {bid?.is_auction == true ? bid?.max_bid_amount ?? "0" : "N/A"}
            </Text>
          </View>

          {/* thired section start here */}
          <View style={styles.myflex}>
            <Text style={styles.text1}>16 Document Title</Text>
            <Text style={styles.text2}>{bid?.docone ?? "-"}</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>17 Document Description</Text>
            <Text style={styles.text2}>{bid?.doconedescription ?? "-"}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>18 File Number</Text>
            <Text style={styles.text2}>{bid?.t_and_c_file_number ?? "-"}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>19 File Subject</Text>
            <Text style={styles.text2}>{bid?.t_and_c_description ?? "-"}</Text>
          </View>
          {/* <View style={styles.myflex}>
            <Text style={styles.text1}>20 Terms & Conditions File</Text>
            <Text style={styles.text2}>{bid?.t_and_c_upload ?? "-"}</Text>
          </View> */}

          <View style={styles.myflex}>
            <Text style={styles.text1}>20 Allowed Bidder Category</Text>
            <Text style={styles.text2}>
              {bid?.is_open ? "Open Bid, " : ""}
              {bid?.is_woman ? "For Women, " : ""}
              {bid?.is_reserved ? "For Reserved Category, " : ""}
              {bid?.is_differently_abled ? "For Differently Abled, " : ""}
              {bid?.is_msme ? "For MSME, " : ""}
              {bid?.is_sc_st ? "For SC/ST, " : ""}
            </Text>
          </View>

          {winnder && (
            <>
              <View>
                <Text style={styles.header}>2. Winner Bidder Details</Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>1 Winner Name</Text>
                <Text style={styles.text2}>
                  {winnder?.user.firstName} {winnder?.user.lastName}
                </Text>
              </View>
              <View style={styles.myflex}>
                <Text style={styles.text1}>2 Winner Mobile</Text>
                <Text style={styles.text2}>{winnder?.user.contactone}</Text>
              </View>
            </>
          )}

          <View>
            <Text style={styles.header}>3. Bidder List Details</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.text1}>Name</Text>
            <Text style={styles.text1}>Number</Text>
            <Text style={styles.text1}>Amount</Text>
            <Text style={styles.text2}>Bid Submit Date</Text>
          </View>

          {bidderList.map((bidder: any, index: number) => (
            <View key={index} style={styles.myflex}>
              <Text style={styles.text1}>
                {index + 1} {bidder?.user.firstName} {bidder?.user.lastName}
              </Text>
              <Text style={styles.text1}>{bidder?.user.contactone}</Text>
              <Text style={styles.text1}>{bidder?.amount}</Text>
              <Text style={styles.text2}>
                {formatDateTime(new Date(bidder?.createdAt))}
              </Text>
            </View>
          ))}

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
