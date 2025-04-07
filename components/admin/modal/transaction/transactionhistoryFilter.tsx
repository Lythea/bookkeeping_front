import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterTransactionsThunk } from "@/app/redux/services/transactionService";
import { AppDispatch } from "@/app/redux/store";
import TransactionHistoryReceipt from "@/components/admin/export/transactionhistory";
import { RootState } from "@/app/redux/store"; // Import the RootState type

interface HistoryInfoProps {
  onClose: () => void;
  transactionNames: string[]; // Accept the list of transaction names
}

const HistoryInfo = ({ onClose, transactionNames }: HistoryInfoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredTransactions, loading, error } = useSelector(
    (state: RootState) => state.transactions // Type the state as RootState
  );

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [dateOption, setDateOption] = useState<"now" | "specific">("now");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]); // Store filtered transactions
  const [isFiltered, setIsFiltered] = useState(false); // Track if filter has been applied

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "from" | "to"
  ) => {
    if (type === "from") {
      setDateFrom(e.target.value);
    } else {
      setDateTo(e.target.value);
    }
  };

  const handleDateOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOption(e.target.value as "now" | "specific");
  };

  const handleApplyFilter = async () => {
    const filters: any = {};
    if (selectedName) filters.name = selectedName;

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

    console.log("Applied Filters:", filters);

    const action = await dispatch(filterTransactionsThunk(filters));

    if (filterTransactionsThunk.fulfilled.match(action)) {
      console.log("Filtered Data:", action.payload);
      setFilteredData(action.payload); // Set the filtered data
      setIsFiltered(true); // Mark that filter is applied
    } else {
      setFilteredData([]); // Set empty array if no data is returned
      setIsFiltered(true); // Mark that filter is applied
      console.error("Failed to fetch filtered transactions.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

        {/* Transaction Name Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Transaction Name
          </label>
          <select
            value={selectedName || ""}
            onChange={(e) => setSelectedName(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a transaction</option>
            {Array.from(new Set(transactionNames)).map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Option Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Date Range
          </label>
          <div className="flex space-x-4">
            <div>
              <input
                type="radio"
                id="now"
                name="dateOption"
                value="now"
                checked={dateOption === "now"}
                onChange={handleDateOptionChange}
                className="mr-2"
              />
              <label htmlFor="now">Now</label>
            </div>
            <div>
              <input
                type="radio"
                id="specific"
                name="dateOption"
                value="specific"
                checked={dateOption === "specific"}
                onChange={handleDateOptionChange}
                className="mr-2"
              />
              <label htmlFor="specific">Specific Date</label>
            </div>
          </div>
        </div>

        {/* Specific Date Range Inputs */}
        {dateOption === "specific" && (
          <div className="mb-4">
            <div className="flex space-x-4">
              <div>
                <label
                  htmlFor="dateFrom"
                  className="block text-sm font-medium mb-2"
                >
                  From:
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => handleDateChange(e, "from")}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="dateTo"
                  className="block text-sm font-medium mb-2"
                >
                  To:
                </label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => handleDateChange(e, "to")}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
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
            {loading ? "Applying Filter..." : "Apply Filter"}
          </button>
        </div>

        {/* Display Filtered Data or a Message */}
        {isFiltered && (
          <>
            {filteredData.length > 0 ? (
              <TransactionHistoryReceipt data={filteredData} />
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
