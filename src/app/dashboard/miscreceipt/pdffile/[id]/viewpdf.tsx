"use client";

import GetAccount from "@/action/account/getaccount";
import { ToWords } from "to-words";

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
  BlobProvider,
  usePDF,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import numberWithIndianFormat, {
  capitalcase,
  formateDate,
} from "@/utils/methods";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ViewPdfProps {
  id: number;
}

const ViewPdf = (props: ViewPdfProps) => {
  const toWords = new ToWords();
  const router = useRouter();

  const [account, setAccount] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const accoutnresponse = await GetAccount({ id: props.id });

      if (accoutnresponse.status) {
        setAccount(accoutnresponse.data);
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
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 8px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },

    lbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 8px",
      textAlign: "center",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
    },

    mtop: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
      // border: "1px solid #6b7280",
      textAlign: "center",
      borderTop: "1px solid #6b7280",
      borderBottom: "1px solid #6b7280",
    },

    mbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
      borderBottom: "1px solid #6b7280",
      // borderRight: "1px solid #6b7280",
      // borderLeft: "1px solid #6b7280",
    },

    rtop: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 8px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },

    rbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 8px",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
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
      width: "60%",
      opacity: 0.1,
    },
  });

  const Quixote = (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View style={styles.imagebox}>
          <Image src="/dnhpda_logo.png" style={styles.image} />
        </View>

        <View>
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
            <View>
              <Text
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Receipt No. PDADNH/online/
                {new Date(account?.createdAt).getFullYear().toString()}/
                {(props?.id ?? "0").toString().padStart(4, "0")}
              </Text>
            </View>

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
                RECEIPT
              </Text>
            </View>
            <View
              style={{
                width: "80px",
              }}
            ></View>

            <View
              style={{
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                Date: {formateDate(new Date(account?.createdAt))}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: "10px",
            }}
          ></View>

          <View>
            <Text
              style={{
                fontSize: 12,
                color: "grey",
                width: "100%",
              }}
              fixed
            >
              Received with thanks from {account?.customername}{" "}
              {account?.customercontact && `[${account?.customercontact}]`} a
              sum of Rs. {numberWithIndianFormat(parseInt(account?.amount))} (
              {account?.amount
                ? capitalcase(
                    toWords.convert(parseInt(account?.amount) ?? "0")
                  ) + " Only"
                : "-"}
              ) on account as below
            </Text>
            <View
              style={{
                marginTop: "5px",
              }}
            ></View>
          </View>
          <View
            style={{
              marginTop: "5px",
            }}
          ></View>

          <View style={styles.myflex}>
            <Text style={styles.ltop}>Sr. No</Text>
            <Text style={styles.mtop}>Income Heads</Text>
            <Text style={styles.rtop}>Amount</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.lbottom}>1</Text>
            <Text style={styles.mbottom}>
              {account?.account_category_one.name}
            </Text>
            <Text style={styles.rbottom}>
              {numberWithIndianFormat(parseInt(account?.amount))}
            </Text>
          </View>
          {account?.account_category_two &&
          account?.account_category_two.name ? (
            <View style={styles.myflex}>
              <Text style={styles.lbottom}>2</Text>
              <Text style={styles.mbottom}>
                {account?.account_category_two.name}
              </Text>
              <Text style={styles.rbottom}>
                {numberWithIndianFormat(parseInt(account?.amount_two))}
              </Text>
            </View>
          ) : null}

          {account?.account_category_three &&
          account?.account_category_three.name ? (
            <View style={styles.myflex}>
              <Text style={styles.lbottom}>3</Text>
              <Text style={styles.mbottom}>
                {account?.account_category_three.name}
              </Text>
              <Text style={styles.rbottom}>
                {numberWithIndianFormat(parseInt(account?.amount_three))}
              </Text>
            </View>
          ) : null}
          {account?.remarks != null && account?.remarks != "" ? (
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
              Remark : {account?.remarks}
            </Text>
          ) : null}

          <View
            style={{
              marginVertical: "10px",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                width: "100%",
              }}
              fixed
            >
              {account?.account_category_one.name ?? "-"} in the form of{" "}
              {account?.paymentmode ?? "-"} vide Reference No.{" "}
              {account?.transactionid ?? "-"} dated{" "}
              {formateDate(new Date(account?.createdAt))}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
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
                  {numberWithIndianFormat(
                    parseInt(account?.amount ?? "0") +
                      parseInt(account?.amount_two ?? "0") +
                      parseInt(account?.amount_three ?? "0")
                  )}{" "}
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
              {/* <Image
                src="/signtwo.jpg"
                style={{
                  width: "100%",
                }}
              /> */}
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
          <Text
            style={{
              textAlign: "center",
              fontSize: "8px",
              position: "absolute",
              width: "100%",
              bottom: "-16px",
            }}
          >
            This is a computer generated receipt and does not required a signature.
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
  //     (output, filePath) => {}
  //   );
  // };

  const [instance, updateInstance] = usePDF({ document: Quixote });

  return (
    <>
      <div className="h-10 flex items-center px-4">
        <p>Receipt</p>
        <div className="grow"></div>
        <Button onClick={() => router.back()} className="h-6 text-sm">
          Close
        </Button>
      </div>
      {isClient ? (
        <div className="w-full h-full">
          {/* <a href={instance.url!} download>
            Download
          </a> */}
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
