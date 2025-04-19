import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
import { updateStatusThunk } from "@/app/redux/services/transactionService";
import { showToast } from "@/components/toast";

interface ModalProps {
  transaction: any;
  onClose: () => void;
}

const StatusModal: React.FC<ModalProps> = ({ transaction, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const selected = form.elements[0] as HTMLSelectElement;
    const newStatus = selected.value;

    await dispatch(updateStatusThunk({ id: transaction.id, status: newStatus }))
      .unwrap()
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Update Status</h2>
        <form onSubmit={handleSubmit} className="my-4">
          <label>Status:</label>
          <select
            className="border p-2 w-full mt-2"
            defaultValue={transaction.status}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
          >
            Update Status
          </button>
        </form>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatusModal;
