"use client";
import app, { auth } from "@/lib/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  QuerySnapshot,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { User as FirebaseUser } from "firebase/auth"; // import FirebaseUser type
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

interface Post {
  id: string;
  [key: string]: any;
}

interface PostContextType {
  posts: Post[];
  getPosts: () => void;
  user: FirebaseUser | null;
  googleSignIn: () => Promise<void>; // googleSignIn now returns Promise<void>
  logOut: () => Promise<void> | undefined;
}

const postsContext = createContext<PostContextType | undefined>(undefined);

interface appContextType {
  children: ReactNode;
}

const AppContext = ({ children }: appContextType) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const db = getFirestore(app);

  const getPosts = async (): Promise<void> => {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, "patientform")
      );
      const postsArray: Post[] = [];

      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const googleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); // Return a promise that resolves when sign-in is complete
    } catch (error) {
      toast.error("Failed to sign in with Google.");
      throw error; // Optional: You can rethrow the error if you want to handle it upstream
    }
  };

  const logOut = (): Promise<void> => {
    return signOut(auth); // signOut returns a promise, so it's compatible
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  const postData = {
    posts,
    getPosts,
    user,
    googleSignIn,
    logOut,
  };

  return (
    <postsContext.Provider value={postData}>{children}</postsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(postsContext);
  if (!context) {
    toast.error("usePosts must be used within a AppContext");
  }
  return context;
};

export default AppContext;
