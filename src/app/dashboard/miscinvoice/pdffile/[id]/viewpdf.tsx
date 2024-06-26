"use client";

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
  usePDF,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import numberWithIndianFormat, {
  capitalcase,
  formateDate,
} from "@/utils/methods";
import GetInvoice from "@/action/invoice/getinvoice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ViewPdfProps {
  id: number;
}

const ViewPdf = (props: ViewPdfProps) => {
  const toWords = new ToWords();
  const [account, setAccount] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const accoutnresponse = await GetInvoice({ id: props.id });

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
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
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
      width: "60px",
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
          <Text style={styles.ltop}>Consignee</Text>
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
              fontFamily: "Oswald",
            }}
          >
            {account?.customername}
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
            {formateDate(new Date(account?.createdAt))}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>GST No.</Text>
          <Text style={styles.mbottom}>{account?.customergst}</Text>
          <Text style={styles.rbottom}>Invoice No.</Text>
          <Text style={styles.mbottom2}>
            PDADNH/INV/
            {new Date(account?.createdAt).getFullYear().toString()}/
            {parseInt(account?.gstinvoice ?? "0")
              .toString()
              .padStart(4, "0")}
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>Address</Text>
          <Text style={styles.mbottom}>{account?.customeraddress}</Text>
          <Text style={styles.rbottom}>State Name</Text>
          <Text style={styles.mbottom2}>{account?.customerplaceofsupply}</Text>
        </View>

        {/* <View
            style={{
              marginTop: "10px",
            }}
          ></View>

        */}
        <View
          style={{
            marginTop: "5px",
          }}
        ></View>

        <View style={styles.myflex}>
          <Text style={styles.ltop}>Sr. No</Text>
          <Text style={styles.mtop}>Income Heads</Text>
          <Text style={styles.rtop2}>HSN</Text>
          <Text style={styles.rtop}>Amount</Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.lbottom}>1</Text>
          <Text style={styles.mbottom}>
            {account?.account_category_one.name}
            {"\n"}
            {account?.remark_cat_one && account?.remark_cat_one != "" ? (
              <Text
                style={{
                  fontSize: "8px",
                  color: "#000",
                }}
              >
                {account?.remark_cat_one}
              </Text>
            ) : null}
          </Text>
          <Text style={styles.rbottom2}>{account?.hsn}</Text>
          <Text style={styles.rbottom}>
            {numberWithIndianFormat(parseFloat(account?.amount))}
          </Text>
        </View>
        {account?.account_category_two && account?.account_category_two.name ? (
          <View style={styles.myflex}>
            <Text style={styles.lbottom}>2</Text>
            <Text style={styles.mbottom}>
              {account?.account_category_two.name}
              {"\n"}
              {account?.remark_cat_two && account?.remark_cat_two != "" ? (
                <Text
                  style={{
                    fontSize: "8px",
                    color: "#000",
                  }}
                >
                  {account?.remark_cat_two}
                </Text>
              ) : null}
            </Text>
            <Text style={styles.rbottom2}>{account?.hsn}</Text>
            <Text style={styles.rbottom}>
              {numberWithIndianFormat(parseFloat(account?.amount_two))}
            </Text>
          </View>
        ) : null}

        {account?.account_category_three &&
        account?.account_category_three.name ? (
          <View style={styles.myflex}>
            <Text style={styles.lbottom}>3</Text>
            <Text style={styles.mbottom}>
              {account?.account_category_three.name}
              {"\n"}
              {account?.remark_cat_three && account?.remark_cat_three != "" ? (
                <Text
                  style={{
                    fontSize: "8px",
                    color: "#000",
                  }}
                >
                  {account?.remark_cat_three}
                </Text>
              ) : null}
            </Text>
            <Text style={styles.rbottom2}>{account?.hsn}</Text>
            <Text style={styles.rbottom}>
              {numberWithIndianFormat(parseFloat(account?.amount_three))}
            </Text>
          </View>
        ) : null}

        {account?.cgst && account?.cgst != "0" ? (
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
              {numberWithIndianFormat(parseFloat(account?.cgst))}
            </Text>
          </View>
        ) : null}
        {account?.ugst && account?.ugst != "0" ? (
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
              UGST
            </Text>
            <Text style={styles.rbottom2}></Text>
            <Text style={styles.rbottom}>
              {numberWithIndianFormat(parseFloat(account?.ugst))}
            </Text>
          </View>
        ) : null}
        {account?.igst && account?.igst != "0" ? (
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
              {numberWithIndianFormat(parseFloat(account?.igst))}
            </Text>
          </View>
        ) : null}

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
            {numberWithIndianFormat(
              parseFloat(
                (
                  parseFloat(account?.amount.toString() ?? "0") +
                  parseFloat(account?.amount_two ?? "0") +
                  parseFloat(account?.amount_three ?? "0") +
                  parseFloat(account?.cgst.toString() ?? "0") +
                  parseFloat(account?.ugst.toString() ?? "0") +
                  parseFloat(account?.igst.toString() ?? "0")
                ).toFixed(0)
              )
            )}
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
                    parseFloat(account?.amount.toString() ?? "0") +
                    parseFloat(account?.amount_two ?? "0") +
                    parseFloat(account?.amount_three ?? "0") +
                    parseFloat(account?.cgst.toString() ?? "0") +
                    parseFloat(account?.ugst.toString() ?? "0") +
                    parseFloat(account?.igst.toString() ?? "0")
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
              // borderBottom: "1px solid #6b7280",
              borderRight: "1px solid #6b7280",
              borderTop: "1px solid #6b7280",
              // borderLeft: "1px solid #6b7280",
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
            {account?.hsn}
          </Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(
              parseFloat(account?.amount.toString() ?? "0") +
                parseFloat(account?.amount_two ?? "0") +
                parseFloat(account?.amount_three ?? "0")
            )}
          </Text>
          <Text style={styles.ltop2}>{account?.cgst_percent}%</Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(parseFloat(account?.cgst))}
          </Text>
          <Text style={styles.ltop2}>{account?.cgst_percent}%</Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(parseFloat(account?.ugst))}
          </Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(
              parseFloat(account?.cgst.toString() ?? "0") +
                parseFloat(account?.ugst.toString() ?? "0")
            )}
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
            {" "}
            {numberWithIndianFormat(
              parseFloat(account?.amount.toString() ?? "0") +
                parseFloat(account?.amount_two ?? "0") +
                parseFloat(account?.amount_three ?? "0")
            )}
          </Text>
          <Text style={styles.ltop2}></Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(parseFloat(account?.cgst))}
          </Text>
          <Text style={styles.ltop2}></Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(parseFloat(account?.ugst))}
          </Text>
          <Text style={styles.ltop2}>
            {numberWithIndianFormat(
              parseFloat(account?.cgst.toString() ?? "0") +
                parseFloat(account?.ugst.toString() ?? "0")
            )}
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
                    parseFloat(account?.cgst.toString() ?? "0") +
                    parseFloat(account?.ugst.toString() ?? "0")
                  ).toString()
                )
              )
            ) +
            " Only"}
        </Text>
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
            Received with thanks from {account?.customername}{" "}
            {account?.customercontact && `[${account?.customercontact}]`} a sum
            of Rs.{" "}
            {numberWithIndianFormat(
              parseFloat(
                (
                  parseFloat(account?.amount.toString() ?? "0") +
                  parseFloat(account?.amount_two ?? "0") +
                  parseFloat(account?.amount_three ?? "0") +
                  parseFloat(account?.cgst.toString() ?? "0") +
                  parseFloat(account?.ugst.toString() ?? "0") +
                  parseFloat(account?.igst.toString() ?? "0")
                ).toFixed(0)
              )
            )}
            (
            {account?.amount
              ? capitalcase(
                  toWords.convert(
                    parseInt(
                      (
                        parseFloat(account?.amount.toString() ?? "0") +
                        parseFloat(account?.amount_two ?? "0") +
                        parseFloat(account?.amount_three ?? "0") +
                        parseFloat(account?.cgst.toString() ?? "0") +
                        parseFloat(account?.ugst.toString() ?? "0") +
                        parseFloat(account?.igst.toString() ?? "0")
                      ).toString()
                    )
                  )
                ) + " Only"
              : "-"}
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
          {account?.remark_cat_one && account?.remark_cat_one != "" ? (
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                margin: "4px 0",
              }}
            >
              1. {account?.account_category_one.name} {account?.remark_cat_one}
            </Text>
          ) : null}
          {account?.remark_cat_two && account?.remark_cat_two != "" ? (
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                margin: "4px 0",
              }}
            >
              2. {account?.account_category_two.name} {account?.remark_cat_two}
            </Text>
          ) : null}

          {account?.remark_cat_three && account?.remark_cat_three != "" ? (
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                margin: "4px 0",
              }}
            >
              3. {account?.account_category_three.name}{" "}
              {account?.remark_cat_three}
            </Text>
          ) : null}

          <View
            style={{
              marginTop: "5px",
            }}
          ></View>
        </View>

        <View style={{}}>
          <Text
            style={{
              fontSize: 10,
              color: "grey",
              width: "100%",
            }}
          >
            in the form of {account?.paymentmode ?? "-"} vide Reference No.{" "}
            {account?.transactionid ?? "-"} dated{" "}
            {formateDate(new Date(account?.createdAt))}
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
                {numberWithIndianFormat(
                  parseFloat(
                    (
                      parseFloat(account?.amount.toString() ?? "0") +
                      parseFloat(account?.amount_two ?? "0") +
                      parseFloat(account?.amount_three ?? "0") +
                      parseFloat(account?.cgst.toString() ?? "0") +
                      parseFloat(account?.ugst.toString() ?? "0") +
                      parseFloat(account?.igst.toString() ?? "0")
                    ).toFixed(0)
                  )
                )}
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
          <Text
            style={{
              textAlign: "center",
              fontSize: "8px",
              position: "absolute",
              width: "100%",
              bottom: "-16px",
            }}
          >
            This is a computer generated statement
          </Text>
        </View>
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
        <p>Tax Invoice - Cum - Receipt</p>
        <div className="grow"></div>
        <Button onClick={() => router.back()} className="h-6 text-sm">
          Close
        </Button>
      </div>
      {isClient ? (
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
