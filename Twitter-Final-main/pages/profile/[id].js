import Head from 'next/head'
import Sidebar from "../../components/Sidebar";
import Widgets from "../../components/Widgets";
import CommentModal from "../../components/CommentModal";
import Post from "../../components/Post";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query, } from 'firebase/firestore';
  import { db } from "../../firebase";
  import { useEffect, useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
import Comment from '../../components/Comment';
import Profile from "../../components/Profile";







export default function Profiles() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);


  // get the post data

  // useEffect(
  //   () => onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot)),
  //   [db, id]
  // );
  //
  // useEffect(() => {
  //   onSnapshot(
  //     query(
  //       collection(db, "posts", id, "comments"),
  //       orderBy("timestamp", "desc")
  //     ),
  //     (snapshot) => setComments(snapshot.docs)
  //   );
  // }, [db, id]);

  useEffect(()=>{
    console.log('hossein',id)
  },[])


  return (
  <Profile id={id}/>
  )
}

