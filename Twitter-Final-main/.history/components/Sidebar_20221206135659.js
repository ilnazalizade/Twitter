import Image from "next/image";
import SidebarMenuItem from "./SidebaeMenuItem";
import { HomeIcon as HomeIconFilled} from "@heroicons/react/solid";
import {
  HomeIcon,
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  HashtagIcon,
  InboxIcon,
  DotsHorizontalIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
// import { HeartIcon as HeartIconFilled  , BookmarkIcon as BookmarkIconFilled } from "@heroicons/react/solid";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {useEffect, useState} from "react";
import { db } from "../firebase";
import { useRouter } from "next/router";
import Link from "next/link";




const BookmarkFilled = () => (
    <svg className="h-7"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
    </svg>
)
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>

)

const UserIconFilled = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>

)

const boxShadow = {
  boxShadow: 'rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px',
  borderRadius:10,
  width:'fit-content',
  minWidth:250
}

export default function Sidebar() {

  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [openLogout,setOpenLogOut] = useState(false)
 // console.log(currentUser);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
        const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        }
      }
      fetchUser();
      }
  })
},[])

function onSignOut() {
  signOut(auth);
  setCurrentUser(null);
}

  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      {/* Twitter Logo */}
      <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
        <Image
          width="50"
          height="50"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/800px-Twitter-logo.svg.png"
        ></Image>
      </div>

      {/* Menu */}
      <div className="mt-4 mb-2.5 xl:items-start">
        <Link  href="/">
           <SidebarMenuItem text="Home" Icon={HomeIcon} ActiveIcon={HomeIconFilled} active={router.pathname === "/"}  />
        </Link>
        <div onClick={() => router.push("/explore/trending")}>
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} /></div>
        {currentUser && (
          <>
            <SidebarMenuItem text="Notifications" Icon={BellIcon} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            <Link href="/bookmarks">
              <SidebarMenuItem text="Bookmarks" onClick={() => router.push("/auth/bookmarks")} active={router.pathname === "/bookmarks"} Icon={BookmarkIcon} ActiveIcon={BookmarkFilled} />
            </Link>
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
            <Link href="/profile">
               <SidebarMenuItem active={router.pathname === "/profile"} text="Profile" Icon={UserIcon} ActiveIcon={UserIconFilled} />
            </Link>
            <SidebarMenuItem text="More" Icon={DotsCircleHorizontalIcon} />
          </>
        )}
      </div>

      {/* Button */}

      {currentUser ? (
        <>

          <button className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
            Tweet
          </button>

          {/* Mini-Profile */}
          <div onClick={() => setOpenLogOut(!openLogout)} className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto relative">

            <img
              src={currentUser?.userImg}
              alt="user-img"
              className="h-10 w-10 rounded-full xl:mr-2"
            />

            <div className="leading-5 hidden xl:inline">
              <h4  className="font-bold">{currentUser?.name}</h4>
              <p className="text-gray-500">@{currentUser?.username}</p>
            </div>

            <DotsHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
            {
              openLogout &&
              <div  onClick={onSignOut} style={boxShadow} className="h-[44px] bg-white absolute bottom-20 left-0 px-4 select-none">
                <p className="text-black font-bold pt-2">Log out @{currentUser?.username}</p>
              </div>
            }
          </div>
        </>
      ) : (
        <button  onClick={() => router.push("/auth/signin")} className="bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">Sign in</button>
      )}
    </div>
  );
}
