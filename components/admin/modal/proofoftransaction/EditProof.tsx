"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateProofOfTransactionThunk } from "@/app/redux/slice/proofoftransactionSlice"; // Import actions
import { useRouter } from "next/navigation";

interface EditProofOfTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofOfTransaction: {
    id: number;
    title: string;
    description: string;
    type: "image" | "video" | "embed";
    content: string;
  } | null;
}

export default function EditProofOfTransactionModal({
  isOpen,
  onClose,
  proofOfTransaction,
}: EditProofOfTransactionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"image" | "video" | "embed">("image");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (proofOfTransaction) {
      setTitle(proofOfTransaction.title);
      setDescription(proofOfTransaction.description);
      setType(proofOfTransaction.type);
      setContent(proofOfTransaction.content);
    }
  }, [proofOfTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (proofOfTransaction) {
      try {
        const updatedProofOfTransaction = {
          id: proofOfTransaction.id,
          title,
          description,
          type,
          content,
        };
        await dispatch(
          updateProofOfTransactionThunk(updatedProofOfTransaction)
        );
        router.refresh();
        onClose(); // Close the modal after editing the proof of transaction
      } catch (error) {
        console.error("Error editing proof of transaction:", error);
      }
    }
  };

  if (!isOpen || !proofOfTransaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">
          Edit Proof of Transaction
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              className="w-full p-2 border rounded mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Type</label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "image" | "video" | "embed")
              }
              required
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="embed">Embed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Content</label>
            <textarea
              className="w-full p-2 border rounded mt-1"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
