import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterTransactionsThunk } from "@/app/redux/services/transactionService";
import { AppDispatch, RootState } from "@/app/redux/store";
import TransactionHistoryReceipt from "@/components/admin/export/transactionhistory";

interface Business {
  business_name: string;
  line_of_business: string;
  registered_address: string;
  started_date: string;
  tin: string;
  zip_code: string;
}

interface Client {
  firstname: string;
  middlename: string;
  lastname: string;
  business: Business[];
}
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

interface HistoryInfoProps {
  onClose: () => void;
  clients: Client[];
  transactions: Transaction[];
}

const HistoryInfo = ({ onClose, clients, transactions }: HistoryInfoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredTransactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  console.log(clients, transactions);
  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(
    null
  );
  const [selectedBusinessName, setSelectedBusinessName] = useState<
    string | null
  >(null);
  const [dateOption, setDateOption] = useState<"now" | "specific">("now");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  console.log(transactions);
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "from" | "to"
  ) => {
    type === "from" ? setDateFrom(e.target.value) : setDateTo(e.target.value);
  };

  const handleDateOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(e.target.value as "now" | "specific");
  };

  const handleApplyFilter = async () => {
    const filters: any = {};

    if (selectedClientIndex !== null) {
      const client = clients[selectedClientIndex];
      filters.name = `${client.firstname} ${client.middlename} ${client.lastname}`;
    }

    if (selectedBusinessName && selectedClientIndex !== null) {
      const client = clients[selectedClientIndex];
      const selectedBiz = client.business.find(
        (b) => b.business_name === selectedBusinessName
      );
      if (selectedBiz) {
        filters.business_name = selectedBiz.business_name;
        filters.tin_id = selectedBiz.tin; // ✅ Include TIN
      }
    }

    if (dateOption === "specific") {
      if (dateFrom && dateTo) {
        filters.dateFrom = dateFrom;
        filters.dateTo = dateTo;
      }
    } else if (dateOption === "now") {
      const today = new Date().toISOString().split("T")[0];
      filters.dateFrom = today;
      filters.dateTo = today;
    }

    const action = await dispatch(filterTransactionsThunk(filters));

    console.log("Filter Action Payload:", filters);

    if (filterTransactionsThunk.fulfilled.match(action)) {
      setFilteredData(action.payload);
      setIsFiltered(true);
    } else {
      setFilteredData([]);
      setIsFiltered(true);
      console.error("Failed to fetch filtered transactions.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

        {/* Select Client */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Client Name
          </label>
          <select
            value={selectedClientIndex ?? ""}
            onChange={(e) => {
              const index = Number(e.target.value);
              setSelectedClientIndex(index);
              setSelectedBusinessName(null); // reset business selection
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a client</option>
            {clients
              .map((client, index) => ({
                index,
                fullName: `${client.firstname} ${client.middlename} ${client.lastname}`,
              }))
              .filter((clientObj) =>
                transactions.some((t) => t.name === clientObj.fullName)
              )
              .map((filteredClient) => (
                <option key={filteredClient.index} value={filteredClient.index}>
                  {filteredClient.fullName}
                </option>
              ))}
          </select>
        </div>

        {/* Select Business (only when a client is selected) */}
        {selectedClientIndex !== null &&
          clients[selectedClientIndex].business &&
          clients[selectedClientIndex].business.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Business
              </label>
              <select
                value={selectedBusinessName ?? ""}
                onChange={(e) => setSelectedBusinessName(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {clients[selectedClientIndex].business.map((biz, idx) => (
                  <option key={idx} value={biz.business_name}>
                    {biz.business_name}
                  </option>
                ))}
              </select>
              {selectedBusinessName &&
                (() => {
                  const biz = clients[selectedClientIndex].business.find(
                    (b) => b.business_name === selectedBusinessName
                  );
                  return biz ? (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        <strong>TIN:</strong> {biz.tin}
                      </p>
                    </div>
                  ) : null;
                })()}
            </div>
          )}

        {/* Date Option */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Date Range
          </label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="dateOption"
                value="now"
                checked={dateOption === "now"}
                onChange={handleDateOptionChange}
                className="mr-2"
              />
              Now
            </label>
            <label>
              <input
                type="radio"
                name="dateOption"
                value="specific"
                checked={dateOption === "specific"}
                onChange={handleDateOptionChange}
                className="mr-2"
              />
              Specific Date
            </label>
          </div>
        </div>

        {/* Specific Dates */}
        {dateOption === "specific" && (
          <div className="mb-4 flex space-x-4">
            <div>
              <label className="block text-sm mb-1">From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateChange(e, "from")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateChange(e, "to")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply Filter"}
          </button>
        </div>

        {/* Results */}
        {isFiltered && (
          <>
            {filteredData.length > 0 ? (
              <TransactionHistoryReceipt
                data={filteredData}
                clients={clients}
              />
            ) : (
              <p className="text-gray-500 mt-4">
                No transactions found for the selected filters.
              </p>
            )}
          </>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default HistoryInfo;
