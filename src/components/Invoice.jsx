// Invoice.jsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { formatDate } from "../lib/utils";

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    marginBottom: 5,
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  footer: { marginTop: 30, textAlign: "center", fontSize: 10 },
});

// Invoice Document
const InvoiceDocument = ({ transaction, company }) => {
  const items = transaction.items || [];
  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  return transaction && (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>{company.name} - Invoice</Text>

        {/* Company Info */}
        <View style={styles.section}>
          <Text>Company: {company.name}</Text>
          <Text>Date: {formatDate(transaction.date)}</Text>
          <Text>Invoice ID: {transaction.id}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={{ width: "40%" }}>Item</Text>
          <Text style={{ width: "20%", textAlign: "center" }}>Qty</Text>
          <Text style={{ width: "20%", textAlign: "right" }}>Price</Text>
          <Text style={{ width: "20%", textAlign: "right" }}>Total</Text>
        </View>

        {/* Items */}
        {items.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={{ width: "40%" }}>{item.itemName}</Text>
            <Text style={{ width: "20%", textAlign: "center" }}>
              {item.quantity}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              ${item.price}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              ${item.amount}
            </Text>
          </View>
        ))}

        {/* Grand Total */}
        <View
          style={{
            ...styles.tableRow,
            borderTop: "1px solid #000",
            marginTop: 10,
            paddingTop: 5,
          }}
        >
          <Text
            style={{
              width: "80%",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            Grand Total:
          </Text>
          <Text
            style={{
              width: "20%",
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            ${grandTotal}
          </Text>
        </View>

        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
};

// Main Component
const Invoice = ({ transaction, company }) => {
  // Print handler
  const handlePrint = async () => {
    const blob = await pdf(
      <InvoiceDocument transaction={transaction} company={company} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url); // opens PDF in new tab
  };

  return transaction && (
    <div className="flex justify-center item-center w-full">
      {/* Download PDF
      <span className="bg-green-500 px-10 py-3 mt-4 text-white rounded-full cursor-pointer">
        <PDFDownloadLink
            document={<InvoiceDocument transaction={transaction} company={company} />}
            fileName={`invoice_${transaction.id}.pdf`}
        >
            {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
        </PDFDownloadLink>
      </span> */}

      {/* Print PDF */}
      <a onClick={handlePrint} className="bg-purple-500 px-10 py-3 mt-4 text-white rounded-full cursor-pointer">Print Invoice</a>
    </div>
  );
};

export default Invoice;
