import generateReceiptPDF from "@/components/admin/export/transactionreceipt"; // Import the generateReceiptPDF function

interface Inquiry {
  name: string;
  price: string;
  service: string;
}

interface Transaction {
  id: number;
  name: string; // Full name of the client
  status: string;
  date: string;
  inquiries: Inquiry[];
  tin_id: string;
  business_name: string;
}

export interface Business {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  middlename: string | null;
  birthday: string;
  email: string | null;
  contact_number: string | null;
  business: Business[];
}

const formatPrice = (price: number) => {
  return `₱${price.toFixed(2)}`;
};

const ViewTransactionModal = ({
  transaction,
  onClose,
  clients,
}: {
  transaction: Transaction;
  onClose: () => void;
  clients: Client[];
}) => {
  // Split the transaction.name into first, middle, and last names
  const [firstName, middleName, lastName] = transaction.name.split(" ");

  // Find the client by matching first name, middle name, and last name
  const client = clients.find(
    (client) =>
      client.firstname === firstName &&
      client.middlename === middleName &&
      client.lastname === lastName
  );

  // Find the matching business within that client by comparing the tin_id
  const matchingBusiness = client?.business?.find(
    (business) => business.tin === transaction.tin_id
  );

  // If the client is found, destructure their details
  const clientDetails = client || {};

  // Accessing the business's registered address if a matching business is found
  const registeredAddress = matchingBusiness?.registered_address;

  const totalPrice = transaction.inquiries.reduce((total, inquiry) => {
    const inquiryPrice = parseFloat(inquiry.price.replace(/[^0-9.-]+/g, "")); // Remove non-numeric characters (if any)
    return total + inquiryPrice;
  }, 0);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl overflow-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Transaction Details
        </h2>

        <div className="space-y-4">
          {/* Displaying transaction details */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-800">{transaction.name}</span>
          </div>
          {/* Displaying client details if the client is found */}
          {client ? (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-800">{client.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Contact:</span>
                <span className="text-gray-800">{client.contact_number}</span>
              </div>
              {registeredAddress && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="text-gray-800">{registeredAddress}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-700">
              Client information not available
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-800">{transaction.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Status:</span>
            <span className="text-gray-800">{transaction.status}</span>
          </div>
        </div>

        {/* Displaying Inquiries Section */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Inquiries:</h3>
          <div className="space-y-2 pl-4 border-l-4 border-gray-300">
            {transaction.inquiries.map((inquiry, index) => (
              <div
                key={index}
                className="flex justify-between py-2 border-b border-gray-100"
              >
                <div>
                  <span className="font-semibold text-gray-800">
                    {inquiry.name}
                  </span>{" "}
                  ({inquiry.service})
                </div>
                <div className="text-gray-700">
                  {formatPrice(parseFloat(inquiry.price))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Displaying Total Price */}
        <div className="mt-4 flex justify-end font-semibold text-gray-700">
          <span>Total Price:</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-6 text-center flex justify-end gap-4">
          <button
            onClick={() => generateReceiptPDF(transaction, client)} // Pass both transaction and client here
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;
