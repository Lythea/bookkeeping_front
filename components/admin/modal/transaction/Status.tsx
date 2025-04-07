import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
import {
  updateStatusThunk,
  updateTransactThunk,
} from "@/app/redux/services/transactionService";
import { showToast } from "@/components/toast";

interface ModalProps {
  transaction: any;
  onClose: () => void;
  modalType: "status" | "transact";
}

const Modal: React.FC<ModalProps> = ({ transaction, onClose, modalType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isStatusModal = modalType === "status";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const select = event.target as HTMLFormElement;
    const selectedValue = select.elements[0] as HTMLSelectElement;

    const newValue = selectedValue.value;

    if (isStatusModal) {
      // Update status
      await dispatch(
        updateStatusThunk({ id: transaction.id, status: newValue })
      )
        .unwrap()
        .then(() => {
          showToast("Status updated successfully", "success");
          router.refresh();
          onClose(); // Close the modal on success
        })
        .catch((error) => {
          showToast("Failed to update status", "error");
        });
    } else {
      // Update transact
      await dispatch(
        updateTransactThunk({ id: transaction.id, transact: newValue })
      )
        .unwrap()
        .then(() => {
          showToast("Transaction updated successfully", "success");
          router.refresh();
          onClose(); // Close the modal on success
        })
        .catch((error) => {
          showToast("Failed to update transaction", "error");
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold">
          {isStatusModal ? "Update Status" : "Transact Status"}
        </h2>
        <form onSubmit={handleSubmit} className="my-4">
          <label>{isStatusModal ? "Status" : "Transact"}:</label>
          <select
            className="border p-2 w-full mt-2"
            defaultValue={
              isStatusModal ? transaction.status : transaction.transact
            }
          >
            <option>{isStatusModal ? "Pending" : "In Progress"}</option>
            <option>{isStatusModal ? "Completed" : "Completed"}</option>
            <option>{isStatusModal ? "Cancelled" : "Failed"}</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
          >
            {isStatusModal ? "Update Status" : "Update Transact"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
