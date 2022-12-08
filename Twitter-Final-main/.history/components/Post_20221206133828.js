import {
    ChartBarIcon,
    ChatIcon,
    BookmarkIcon,
    BookmarkAltIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
  } from "@heroicons/react/outline";


  import {setDoc, doc, collection, onSnapshot, deleteDoc, updateDoc} from "firebase/firestore";
  import Moment from "react-moment";
  import { db, storage } from "../firebase";
  import { useState, useEffect } from "react";
  import { HeartIcon as HeartIconFilled  , BookmarkIcon as BookmarkIconFilled } from "@heroicons/react/solid";
  import {deleteObject, getDownloadURL, ref, uploadString} from "firebase/storage";
  import { modalState, postIdState } from "../atom/modalAtom";
  import { useRecoilState } from "recoil";
  import { useRouter } from "next/router";
  import { userState } from "../atom/userAtom";





export default function Post({post,id,bookmark}) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser] = useRecoilState(userState);
  const router = useRouter();




  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db]);


  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser]);


  async function likePost() {
    if(currentUser){
       if (hasLiked) {
    await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));

    } else {
    await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
    username: currentUser?.username,
    })
    }
   } else{
    //signIn()
    router.push("/auth/signin");

   }
}


const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi



async function deletePost() {
  if (window.confirm("Are you sure you want to delete this post?")) {
    deleteDoc(doc(db, "posts", id));
    if (post.data().image) {
      deleteObject(ref(storage, `posts/${id}/image`));
    }
    router.push("/");
  }
}


const bookmarked = (isBookmarked) => {
    updateDoc(doc(db, "posts", id), {
        isBookmarked: !isBookmarked,
    })
}

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* image */}
<img className="h-11 w-11 rounded-full mr-4"

src={post?.data()?.userImg} alt=""/>


       {/* Righ side */}
       <div className="flex-1">

           {/* Header */}
         <div className="flex items-center justify-between">

          {/* post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
          <h4 onClick={() => router.push(`/profile/${post?.data()?.id}`)} className="font-bold text-[15px] sm:text-[16px] hover:underline">{post?.data()?.name}</h4>
          <span className="text-sm sm:text-[15px]">@{post?.data()?.username} - </span>
          <span className="text-sm sm:text-[15px] hover:underline">
          <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
          </span>
          </div>
           {/* dot icon */}
           <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
          </div>
          {/* post text */}
          <div
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
              <p className="w-full block break-all" dangerouslySetInnerHTML={{ __html: post?.data()?.text.replace(re,`<a style="color:blue" href="$1" target="_blank" rel="noreferrer">$1</a>`) }} />
          </div>

           {/* post image */}
            <img
             onClick={() => router.push(`/posts/${id}`)}
             className="rounded-2xl mr-2" src={post?.data()?.image} alt=""/>

            {/* Icons */}
           {  <div className="flex items-center select-none -ml-2 gap-2">
               <div className="flex items-center select-none">
                   <ChatIcon
                       onClick={() => {
                           if (!currentUser) {
                               //signIn();
                               router.push("/auth/signin");
                           }else {
                               setPostId(id)
                               setOpen(!open)
                           }
                       }}
                       className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                   {comments.length > 0 && (
                       <span className="text-sm">{comments.length}</span>
                   )}
               </div>
               {currentUser?.uid === post?.data()?.id && (
                   <TrashIcon onClick={deletePost} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"/>
               )}
               <div className="flex items-center">
                   {hasLiked ? (
                       <HeartIconFilled onClick={likePost} className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100" />
                   ) : (
                       <HeartIcon onClick={likePost} className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100 "/>
                   )}
                   {likes.length > 0 && (
                       <span
                           className={`${hasLiked && "text-red-600"} text-sm select-none`}
                       >
                {" "}
                           {likes.length}
              </span>
                   )}
               </div>
               <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
               {//currentUser?.uid === post?.data()?.id &&
                  <>
                  {
                      post?.data()?.isBookmarked ?
                          <div onClick={() => bookmarked(post?.data()?.isBookmarked)} className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100">
                              <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                              </svg>
                          </div>
                          :
                          <BookmarkIcon onClick={() => bookmarked(post?.data()?.isBookmarked)} className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                  }
                  </>
               }

           </div>}
      </div>
      </div>
  )
}
