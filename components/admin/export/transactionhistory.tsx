import { useEffect } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

// Define a type for the data expected in the transaction history.
interface Inquiry {
  quantity: number;
  totalPrice: number;
  name: string;
  price: string;
  service: string;
}

interface Client {
  business_name: string;
  name: string;
  businessName: string;
  address: string;
}

interface Transaction {
  address: any;
  business_name: any;
  name: any;
  invoiceNumber: string;
  date: string;
  client: Client;
  inquiries: Inquiry[];
}

interface TransactionHistoryReceiptProps {
  data: Transaction[];
  clients: any[];
}

const TransactionHistoryReceipt = ({
  data,
  clients,
}: TransactionHistoryReceiptProps) => {
  console.log(data, clients);
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [6, 7.5], // Half-page width, full height
    });

    const marginLeft = 0.3;
    const rightColumnX = 4;

    // HEADER SECTION - First Column: WE Guarantee and details

    // Add the logo on the left side (first column)
    doc.addImage(
      "/logo/MainLogo.jfif",
      "JPEG",
      marginLeft - 0.2,
      0.2,
      0.8,
      0.8
    ); // Logo image

    // Text content starts on the right of the logo (second column)
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("W&E Guarantee", marginLeft + 0.5, 0.5); // Text to the right of the logo

    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Phone: 0916-286-5399 / 0915-113-3693", marginLeft + 0.5, 0.65); // Right column text
    doc.text("Email: webs.sanjuanbatangas@gmail.com", marginLeft + 0.5, 0.8); // Right column text
    doc.text(
      "Location: Pastor Avenue, Palloc  an West, Batangas City",
      marginLeft + 0.5,
      0.95
    ); // Right column text

    // HEADER SECTION - Second Column: Invoice Title, INVOICE #, Date
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text("INVOICE", rightColumnX + 0.1, 0.5);

    // Reset color back to black
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(10);
    doc.setFont("times", "normal");

    const currentDate = new Date().toLocaleDateString();

    // Invoice Number and Date
    doc.text("INVOICE #:", rightColumnX + 0.1, 0.75);
    doc.text("DATE:", rightColumnX + 0.1, 0.95);

    if (data.length > 0) {
      const firstTransaction = data[0];
      // Add invoice number value
      doc.text(
        firstTransaction.invoiceNumber || "____________",
        rightColumnX + 1,
        0.75
      );
      // Add date value below the label
      doc.text(firstTransaction.date || currentDate, rightColumnX + 1, 0.95);
    } else {
      doc.text("No data available", marginLeft, 1.0);
    }

    // Define color tuples
    const blueColor: [number, number, number] = [0, 102, 204];
    const whiteColor: [number, number, number] = [255, 255, 255];

    // Dimensions
    const labelWidth = 40;
    const labelHeight = 0.25;

    // === BILL TO Section ===
    // === BILL TO Section ===
    if (data.length > 0) {
      const firstTransaction = data[0];

      // Draw blue background for BILL TO
      doc.setFillColor(...blueColor);
      doc.rect(marginLeft - 1.2, 1.3, labelWidth, labelHeight, "F");

      // White "BILL TO" text
      doc.setTextColor(...whiteColor);
      doc.setFontSize(11);
      doc.setFont("times", "bold");
      doc.text("BILL TO", marginLeft, 1.5);

      // Reset text color to black
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("times", "normal");

      // Build full name from client data and match with transaction name
      // Build full name from client data and match with transaction name
      const matchedClient = clients.find((client) => {
        const fullName =
          `${client.firstname} ${client.middlename} ${client.lastname}`
            .trim()
            .toUpperCase();
        return fullName === firstTransaction.name.toUpperCase();
      });

      const business = matchedClient?.business?.[0];

      doc.text(
        firstTransaction.name?.toUpperCase() || "Client Name",
        marginLeft,
        1.7
      );
      doc.text(
        business?.business_name?.toUpperCase() || "Business Name",
        marginLeft,
        1.9
      );
      doc.text(
        business?.registered_address?.toUpperCase() || "Address",
        marginLeft,
        2.1
      );
    } else {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("No client data available", marginLeft, 1.2);
    }

    // === TERMS Section ===
    // Draw blue background for TERMS
    doc.setFillColor(...blueColor);
    doc.rect(rightColumnX + 0.3, 1.3, labelWidth, labelHeight, "F");

    // White "TERMS" text
    doc.setTextColor(...whiteColor);
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("TERMS", rightColumnX + 0.5, 1.5);

    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text("Due Upon Receipt", rightColumnX + 0.5, 1.7);

    // TABLE SECTION: Group Inquiries by Service
    let currentY = 2.5;
    const services = data.reduce((acc, transaction) => {
      transaction.inquiries.forEach((inquiry) => {
        if (!acc[inquiry.service]) {
          acc[inquiry.service] = [];
        }

        // Check if the inquiry already exists for the same service and name
        const existingInquiry = acc[inquiry.service].find(
          (item) => item.name === inquiry.name
        );
        if (existingInquiry) {
          // If found, accumulate quantity and price
          existingInquiry.quantity += 1;
          existingInquiry.totalPrice += parseFloat(inquiry.price);
        } else {
          // Otherwise, add new inquiry with quantity 1
          acc[inquiry.service].push({
            ...inquiry,
            quantity: 1,
            totalPrice: parseFloat(inquiry.price),
          });
        }
      });
      return acc;
    }, {} as Record<string, Inquiry[]>);
    const docWidth = doc.internal.pageSize.width;
    const totalWidth = docWidth - marginLeft * 0; // Adjusting margin
    const colWidth = totalWidth / 4; // Divide the width by the number of columns

    // === Table Header Background ===

    // Dimensions for table header
    const headerHeight = 0.3;

    doc.setFillColor(...blueColor); // Blue background
    doc.rect(marginLeft - 0.3, currentY - 0.2, totalWidth, headerHeight, "F");

    // Set white text for column headers
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.setTextColor(...whiteColor);

    doc.text("DESCRIPTION", marginLeft, currentY);
    doc.text("QUANTITY", marginLeft * 2.5 + colWidth, currentY);
    doc.text("UNIT PRICE", marginLeft * 1.7 + colWidth * 2, currentY);
    doc.text("AMOUNT", marginLeft * 1.9 + colWidth * 3, currentY);

    doc.setTextColor(0, 0, 0);
    currentY += 0.3; // Space after header

    let totalAmount = 0; // Variable to store the total amount

    Object.keys(services).forEach((service, index) => {
      const inquiries = services[service];

      doc.setFontSize(10);
      doc.setFont("times", "bold");
      doc.text(service.toLocaleUpperCase(), marginLeft, currentY);
      currentY += 0.2;

      inquiries.forEach((inquiry) => {
        doc.setFontSize(10);
        doc.setFont("times", "normal");

        // For text-left alignment, use the X positions that start at the leftmost point of each column
        const descriptionX = marginLeft * 0 + colWidth / 2;
        const quantityX = marginLeft * 3.6 + colWidth;
        const unitPriceX = marginLeft * 1.7 + colWidth * 2;
        const priceX = marginLeft * 1.4 + colWidth * 3;

        const formattedUnitPrice = `Php ${parseFloat(inquiry.price)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
        const formattedTotalPrice = `Php ${new Intl.NumberFormat("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(inquiry.totalPrice)}`;

        doc.text(inquiry.name, descriptionX, currentY);
        doc.text(inquiry.quantity.toString(), quantityX, currentY);
        doc.text(formattedUnitPrice, unitPriceX, currentY); // Formatted unit price with commas
        doc.text(formattedTotalPrice, priceX, currentY); // Formatted total price with commas

        totalAmount += inquiry.totalPrice;
        currentY += 0.17;
      });

      // 🔽 Add a very thin horizontal line after each service group
      doc.setLineWidth(0.01); // Extra thin line
      doc.line(marginLeft, currentY, marginLeft + colWidth * 3.65, currentY);

      currentY += 0.2; // Add spacing after the line
    });

    const footerText = "Thank you for your business!";
    const footerX = marginLeft; // Left corner for the footer text
    const footerY = currentY; // Position the footer after the service data

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(footerText, footerX, footerY);

    currentY += 0.0;
    const downpayment = 10000.0;
    const tax = 0;
    const total = totalAmount - downpayment + tax;

    doc.setFontSize(10);
    doc.setFont("times", "normal");

    // Set positions for the right-aligned summary and left-aligned contact

    const summaryX = marginLeft + 3.7; // Summary on the right, adjust this as needed for right-alignment
    let contactY = currentY;
    let summaryY = currentY;

    // ** Summary Section (Right)** - Ensure the subtotal is right-aligned at the page's edge
    doc.setFontSize(10);
    doc.setFont("times", "normal");

    // Right-aligned summary (Subtotal, Downpayment, Tax, and Total balance)
    doc.text(
      `SUBTOTAL: Php ${totalAmount
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`,
      summaryX,
      summaryY
    );
    summaryY += 0.2;

    doc.text(`DOWNPAYMENT: _________ `, summaryX, summaryY);
    summaryY += 0.2;

    doc.text(`TAX: ____________________ `, summaryX, summaryY);
    summaryY += 0.2;

    doc.text(`TOTAL (balance): __________ `, summaryX, summaryY);
    summaryY += 0.2;

    // ** Contact Section (Left)** - Move this section below the summary
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    contactY = Math.max(summaryY, contactY); // Make sure contact section starts below the summary

    const pageWidth = doc.internal.pageSize.width; // Get the page width
    const textWidth = doc.getTextWidth(
      "If you have any questions, please contact:"
    ); // Get the width of the header text
    const contactX = (pageWidth - textWidth) / 2; // Calculate the X position for centering

    contactY += 0.3; // Adjust Y position for the next text

    // Title: Centralized
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("If you have any questions, please contact:", contactX, contactY);
    contactY += 0.3;

    // Contact Details (Centering each line)
    doc.setFontSize(10);
    doc.setFont("times", "normal");

    const contactNameWidth = doc.getTextWidth("MA PEARL MACAWILI");
    const contactNameX = (pageWidth - contactNameWidth) / 2;
    doc.text("MA PEARL MACAWILI", contactNameX, contactY);
    contactY += 0.2;

    const contactNumberWidth = doc.getTextWidth("09162865399");
    const contactNumberX = (pageWidth - contactNumberWidth) / 2;
    doc.text("09162865399", contactNumberX, contactY);
    contactY += 0.2;

    const contactEmailWidth = doc.getTextWidth("weguaranteeonline@gmail.com");
    const contactEmailX = (pageWidth - contactEmailWidth) / 2;
    doc.text("weguaranteeonline@gmail.com", contactEmailX, contactY);

    // Move currentY down for any new section afterward
    currentY = Math.max(summaryY, contactY) + 0.2;

    // Center the footer text in the second column

    // Save the PDF document
    doc.save("transaction_history.pdf");
  };

  useEffect(() => {
    if (data.length > 0) {
      generatePDF(); // Generate PDF when data is available
    }
  }, [data]);

  return <></>; // No visible component
};

export default TransactionHistoryReceipt;
