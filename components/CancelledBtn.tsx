import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { doc, deleteDoc, getFirestore } from "firebase/firestore"; // Make sure to import these from Firebase
import { usePosts } from "@/context/AppContext";
import { toast } from "react-toastify";
import app from "@/lib/firebase";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import the CSS

const CancelledBtn = ({ Id }: any) => {
  const { posts, getPosts } = usePosts()!;
  const db = getFirestore(app);

  const handleDelete = async (postId: string) => {
    try {
      const postRef = doc(db, "patientform", postId);
      await deleteDoc(postRef);
      getPosts();
      toast.success("Your post has been successfully deleted");
    } catch (error) {
      toast.error("Error deleting the post");
    }
  };

  return (
    <div>
      <Button
        className="min-w-[120px]"
        onClick={() => handleDelete(Id)} // Pass the item (or an appropriate value) to handleDelete
      >
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
