import { useEffect } from "react";
import jsPDF from "jspdf"; // Import jsPDF

interface TransactionHistoryReceiptProps {
  data: any[];
}

const TransactionHistoryReceipt = ({
  data,
}: TransactionHistoryReceiptProps) => {
  const generatePDF = () => {
    const doc = new jsPDF("landscape", "in", "letter");

    // HEADER SECTION (Centered, half crosswise)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("WE Guarantee", 2.125, 0.4, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Phone: 0916-286-5399 / 0915-113-3693", 2.125, 0.6, {
      align: "center",
    });
    doc.text("Email: webs.sanjuanbatangas@gmail.com", 2.125, 0.75, {
      align: "center",
    });
    doc.text(
      "Location: Pastor Avenue, Pallocan West, Batangas City",
      2.125,
      0.9,
      { align: "center" }
    );

    // TABLE/CONTENT SECTION (Transactions Data)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Header for the table
    const headers = ["Transaction Name", "Date", "Status", "Service"];
    let startY = 1.2;
    doc.autoTable({
      startY,
      head: [headers],
      body: data.map((transaction) => [
        transaction.name,
        transaction.date,
        transaction.status,
        transaction.inquiries.map((inquiry: any) => inquiry.service).join(", "),
      ]),
    });

    // Save PDF
    doc.save("transaction_history.pdf");
  };

  useEffect(() => {
    if (data.length > 0) {
      generatePDF();
    }
  }, [data]);

  return (
    <div>
      <h3>Filtered Transactions</h3>
      <ul>
        {data.map((transaction, index) => (
          <li key={index}>
            {transaction.name} - {transaction.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistoryReceipt;
