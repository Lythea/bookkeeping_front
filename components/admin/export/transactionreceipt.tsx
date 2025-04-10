import { jsPDF } from "jspdf";

interface Inquiry {
  name: string;
  price: string;
  service: string;
}

interface Transaction {
  id: number;
  address: string;
  contact: string;
  created_at: string;
  date: string;
  email: string;
  inquiries: Inquiry[];
  name: string;
  status: string;
  transact: string;
  updated_at: string;
}

const generateReceiptPDF = (transaction: Transaction) => {
  const doc = new jsPDF({ unit: "in", format: [4.25, 5.5] });

  // HEADER SECTION
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

  // Divider Line
  doc.setLineWidth(0.01);
  doc.line(0.25, 1.05, 4, 1.05);

  // TRANSACTION DETAILS SECTION
  doc.setFontSize(10);
  let y = 1.3;

  doc.text(`Name: ${transaction.name}`, 0.25, y);
  doc.text(`Date: ${transaction.date}`, 2.25, y);

  y += 0.2;
  doc.text(`Address: ${transaction.address}`, 2.25, y);
  doc.text(`Email: ${transaction.email}`, 0.25, y);

  y += 0.2;
  doc.text(`Contact: ${transaction.contact}`, 0.25, y);

  // Divider Line before inquiries
  y += 0.2;
  doc.line(0.25, y, 4, y);
  y += 0.15;

  // INQUIRIES SECTION
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Inquiries", 0.25, y);
  doc.setFont("helvetica", "normal");

  y += 0.2;

  transaction.inquiries.forEach((inq, index) => {
    doc.setFontSize(10);
    doc.text(`${inq.service}`, 0.25, y);
    y += 0.15;
    doc.text(`${inq.name} `, 0.35, y); // Adding right arrow after name

    // Price inline with the name
    doc.text(`Price: Php ${parseFloat(inq.price).toLocaleString()}`, 3.1, y);
    y += 0.25; // space between inquiries
  });

  // TOTAL PRICE
  const totalAmount = transaction.inquiries.reduce(
    (total, inq) => total + parseFloat(inq.price),
    0
  );

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  // Define the text to be underlined
  const totalText = `Total: Php ${totalAmount.toLocaleString()}`;

  // Calculate the width of the text
  const textWidth = doc.getTextWidth(totalText);

  // The right-aligned X position
  const rightAlignX = 4.25 - textWidth - 0.25; // 4.25 is the page width, 0.25 is the margin

  // Set the starting point for the line above the text
  const lineStartY = y - 0.2; // Y position of the line, slightly above the text
  const lineEndX = rightAlignX + textWidth; // Ending X position based on the text width

  // Draw the line
  doc.line(rightAlignX, lineStartY, lineEndX, lineStartY);

  // Add the "Total" text below the line
  doc.text(totalText, rightAlignX, y);

  // Increase y position for further content
  y += 0.3;

  // FOOTER
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your transaction!", 2.125, y, { align: "center" });

  // SAVE PDF
  doc.save(`Transaction_Receipt_${transaction.id}.pdf`);
};

export default generateReceiptPDF;
