import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { doc, deleteDoc, getFirestore } from "firebase/firestore"; // Make sure to import these from Firebase
import { usePosts } from "@/context/AppContext";
import { toast } from "react-toastify";
import app from "@/lib/firebase";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import the CSS

interface CancelledBtnProps {
  Id: string; // Define the Id as string
}

const CancelledBtn = ({ Id }: CancelledBtnProps) => {
  const { getPosts } = usePosts()!;
  const db = getFirestore(app);

  const handleDelete = async (postId: string) => {
    try {
      const postRef = doc(db, "patientform", postId);
      await deleteDoc(postRef);
      getPosts();
      toast.success("Your post has been successfully deleted");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message); // Access message safely
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <Button className="min-w-[120px]" onClick={() => handleDelete(Id)}>
        <Image
          src="/assets/icons/cancelled.svg"
          width={20}
          height={20}
          alt="cancelled"
        />
        Cancelled
      </Button>
    </div>
  );
};

export default CancelledBtn;
