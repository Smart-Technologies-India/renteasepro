"use client";

import GetBid from "@/action/bid/getbid";
import GetFromBidId from "@/action/bid_transact/getfrombidid";
import BackButton from "@/components/backbutton";
import { formatDateTime, formateDate, decryptURLData } from "@/utils/methods";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ViewPdf = () => {
  const router = useRouter();
  const [bid, setBid] = useState<any>();
  const [bidderList, setBidderList] = useState<any[] | null>([]);

  const [winnder, setWinnder] = useState<any>();
  const param = useParams();
  const encid: string = decryptURLData(
    Array.isArray(param.id) ? param.id[0] : param.id ?? "0",
    router
  );
  const id: number = parseInt(encid);

  useEffect(() => {
    const init = async () => {
      const bidresponse = await GetBid({ id: id });

      if (bidresponse.status) {
        setBid(bidresponse.data);
      }

      const bidderresponse = await GetFromBidId({ id: id });
      if (bidderresponse.status) {
        setBidderList(bidderresponse.data);
      }

      // get winnder of the bid and set the winnder

      const winnderdata = bidderresponse.data?.filter(
        (value: any) => value.status == "WINNINGBID"
      );

      if (winnderdata && winnderdata.length > 0) {
        setWinnder(winnderdata[0]);
      }
    };

    init();
  }, [id]);
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
    mtop3: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
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
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    mbottom3: {
      fontSize: "9px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
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
          <Text style={styles.title}>Planning and Development Authority</Text>
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
              Bid - Report
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: "10px",
          }}
        ></View>

        <View style={styles.myflex}>
          <Text style={styles.ltop}>Bid No.</Text>
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
            {bid?.id}
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
            Bid Date
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
          <Text style={styles.lbottom}>Property Name</Text>
          <Text style={styles.mbottom}>{bid?.shop.property.name}</Text>
          <Text style={styles.rbottom}>Shop Number</Text>
          <Text style={styles.mbottom2}>{bid?.shop.shopNumber}</Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Bid Title</Text>
          <Text style={styles.mbottom}>{bid?.title}</Text>
          <Text style={styles.rbottom}>Fees Amount</Text>
          <Text style={styles.mbottom2}>{bid?.fees_amount ?? "-"}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Emd Amount</Text>
          <Text style={styles.mbottom}>{bid?.emd_amount ?? "-"}</Text>
          <Text style={styles.rbottom}>Bg Amount</Text>
          <Text style={styles.mbottom2}>{bid?.bg_amount ?? "-"}</Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Bid Start Date</Text>
          <Text style={styles.mbottom}>
            {formatDateTime(new Date(bid?.bidstartdate))}
          </Text>
          <Text style={styles.rbottom}>Bid End Date</Text>
          <Text style={styles.mbottom2}>
            {" "}
            {formatDateTime(new Date(bid?.bidenddate))}
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Min Bid Value</Text>
          <Text style={styles.mbottom}>
            &#8377;{bid?.min_bid_amount ?? "0"}
          </Text>
          <Text style={styles.rbottom}>Max Bidding</Text>
          <Text style={styles.mbottom2}>
            {bid?.is_auction == true ? bid?.max_bid_amount ?? "0" : "N/A"}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Allowed Bidder Category</Text>
          <Text style={styles.mbottom}>
            {" "}
            {bid?.is_open ? "Open Bid, " : ""}
            {bid?.is_woman ? "For Women, " : ""}
            {bid?.is_reserved ? "For Reserved Category, " : ""}
            {bid?.is_differently_abled ? "For Differently Abled, " : ""}
            {bid?.is_msme ? "For MSME, " : ""}
            {bid?.is_sc_st ? "For SC/ST, " : ""}
          </Text>
          <Text style={styles.rbottom}>Bidders Count</Text>
          <Text style={styles.mbottom2}>{bidderList?.length}</Text>
        </View>

        {winnder && (
          <>
            <View style={styles.myflex}>
              <Text style={styles.lbottom}>Winner Name</Text>
              <Text style={styles.mbottom}>
                {winnder?.user.firstName} {winnder?.user.lastName}
              </Text>
              <Text style={styles.rbottom}>Winner Mobile</Text>
              <Text style={styles.mbottom2}>{winnder?.user.contactone}</Text>
            </View>
          </>
        )}

        <View
          style={{
            marginTop: "5px",
          }}
        ></View>

        <View style={styles.myflex}>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              width: "40px",
              padding: "4px 4px",
              border: "1px solid #6b7280",
              textAlign: "center",
            }}
          >
            No
          </Text>
          <Text style={styles.mtop2}>Bidder Name</Text>
          <Text style={styles.mtop3}>Date</Text>
          <Text style={styles.mtop3}>Amount</Text>
          <Text style={styles.mtop3}>Status</Text>
          <Text style={styles.mtop2}>Remark</Text>
        </View>

        {(bidderList ?? []).map((bidder: any, index: number) => (
          <View key={index} style={styles.myflex}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "normal",
                color: "#374151",
                width: "40px",
                padding: "4px 4px",
                textAlign: "center",
                borderBottom: "1px solid #6b7280",
                borderRight: "1px solid #6b7280",
                borderLeft: "1px solid #6b7280",
              }}
            >
              {index + 1}
            </Text>
            <Text style={styles.mbottom2}>
              {bidder.user.firstName} {bidder.user.lastName} [
              {bidder.user.contactone}]
            </Text>
            <Text style={styles.mbottom3}>
              {formateDate(new Date(bidder.createdAt))}
            </Text>
            <Text style={styles.mbottom3}>{bidder.amount ?? "-"}</Text>
            <Text style={styles.mbottom3}>{bidder.status ?? "-"}</Text>
            <Text style={styles.mbottom2}>
              {bidder.rejectedreason
                ? bidder.rejectedreason
                : bidder.biddocreason ?? "-"}
            </Text>
          </View>
        ))}

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
          ></View>

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
      {/* {isClient ? (
        <PDFDownloadLink document={<Quixote />} fileName="download.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      ) : null} */}
      {isClient ? (
        <div className="h-[85vh] m-4 rounded-md shadow-md border">
          <div className="w-full h-full">
            <div className="bg-white p-2">
              <BackButton />
            </div>
            <embed
              src={instance.url!}
              className="w-full h-full"
              type="application/pdf"
            />
            {/* <PDFViewer style={{ width: "100%", height: "100%" }}>
            <Quixote />
          </PDFViewer> */}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ViewPdf;
