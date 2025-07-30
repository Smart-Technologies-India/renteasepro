"use client";

import GetUser from "@/action/user/getuser";
import { capitalcase, formateDate } from "@/utils/methods";
import { ToWords } from "to-words";
import { eachDayOfInterval } from "date-fns";

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
import GetPropertyReport from "@/action/daily_property/getpropertyreport";

interface ViewPdfProps {
  id: number;
}

interface ReportDataType {
  user: string;
  date: Date;
  place: string;
  time: string;
  event_name: string;
  remark: string;
}

const ViewPdf = (props: ViewPdfProps) => {
  const [isloading, setIsloading] = useState(false);

  const toWords = new ToWords();
  const router = useRouter();

  const [reportdata, setReportData] = useState<
    Array<
      daily_rent & {
        rent_transact: daily_rent_transact[];
        user: user | null;
        daily_shop: daily_shop & {
          property: daily_property | null;
        };
      }
    >
  >([]);

  const [report, setReport] = useState<Array<ReportDataType>>([]);

  useEffect(() => {
    const init = async () => {
      setIsloading(true);
      const rentresponse = await GetPropertyReport({
        id: props.id,
        all: props.id.toString() == "2",
      });
      if (rentresponse.status && rentresponse.data) {
        setReportData(rentresponse.data);

        let data: Array<ReportDataType> = [];

        rentresponse.data.forEach((item) => {
          if (item.prep_day) {
            data.push({
              user: item.user?.firstName + " " + item.user?.lastName,
              date: item.prep_day,
              place: item.daily_shop?.name || "N/A",
              time: "5 PM to 10 PM",
              event_name: item.event_reason,
              remark: "Preprep Day",
            });
          }
          if (item.handover_day) {
            data.push({
              user: item.user?.firstName + " " + item.user?.lastName,
              date: item.handover_day,
              place: item.daily_shop?.name || "N/A",
              time: "7 AM to 1 PM",
              event_name: item.event_reason || "N/A",
              remark: "Handover Day",
            });
          }
          // Add one entry for each date from event_from_date to event_to_date
          if (item.event_from_date && item.event_to_date) {
            const allDates = eachDayOfInterval({
              start: new Date(item.event_from_date),
              end: new Date(item.event_to_date),
            });
            allDates.forEach((d) => {
              data.push({
                user: item.user?.firstName + " " + item.user?.lastName,
                date: d,
                place: item.daily_shop?.name || "N/A",
                time: "7 AM to 10 PM",
                event_name: item.event_reason || "N/A",
                remark: "Main Event",
              });
            });
          }
        });
        data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setReport(data);
      }
      setIsloading(false);
    };

    init();
  }, [props.id]);
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
      fontSize: 16,
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
      width: "40px",
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

  function getFinancialYear(transactionDate: Date): string {
    const month = transactionDate.getMonth() + 1; // getMonth() is 0-based
    const year = transactionDate.getFullYear();

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
          <Text style={styles.title}>
            {props.id.toString() == "2" ? "Booking Report" : "Weekly Report"}
          </Text>
          <View
            style={{
              height: "10px",
            }}
          ></View>
          <Text style={styles.subtitle}>
            {reportdata.length != 0
              ? reportdata[0].daily_shop.property?.name
              : ""}
          </Text>
          <View
            style={{
              height: "10px",
            }}
          ></View>
        </View>

        {props.id.toString() == "2" ? (
          <></>
        ) : (
          <>
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
                  {`From ${formateDate(new Date())} to ${formateDate(
                    new Date(new Date().setDate(new Date().getDate() + 15))
                  )}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: "10px",
              }}
            ></View>
          </>
        )}

        <View style={styles.myflex}>
          <Text style={styles.ltop}>Sr. No.</Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              textAlign: "left",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            Client
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "left",
            }}
          >
            Date of event
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "left",
            }}
          >
            Place
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "left",
            }}
          >
            Time
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              textAlign: "left",
            }}
          >
            Function
          </Text>
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#374151",
              flex: 2,
              padding: "4px 4px",
              textAlign: "left",
              borderTop: "1px solid #6b7280",
              borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
            }}
          >
            Remark
          </Text>
        </View>
        {report.map((item, index) => (
          <>
            <View style={styles.myflex} key={index}>
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
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  textAlign: "left",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                }}
              >
                {item.user}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                  textAlign: "left",
                }}
              >
                {formateDate(item.date)}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                  textAlign: "left",
                }}
              >
                {item.place}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                  textAlign: "left",
                }}
              >
                {item.time}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                  textAlign: "left",
                }}
              >
                {item.event_name}
              </Text>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  color: "#374151",
                  flex: 2,
                  padding: "4px 4px",
                  textAlign: "left",
                  borderBottom: "1px solid #6b7280",
                  borderRight: "1px solid #6b7280",
                }}
              >
                {item.remark}
              </Text>
            </View>
          </>
        ))}
      </Page>
    </Document>
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      updateInstance(Quixote);
    }, 3000);
  }, [Quixote]);

  const [instance, updateInstance] = usePDF({ document: Quixote });

  return (
    <>
      <div className="h-10 flex items-center px-4">
        <p>Weekly report</p>
        <div className="grow"></div>
        <Button onClick={() => router.back()} className="h-6 text-sm">
          Close
        </Button>
      </div>

      {isClient && isloading == false ? (
        <div className="w-full h-full">
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
