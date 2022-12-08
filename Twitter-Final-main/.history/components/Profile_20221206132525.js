import {SparklesIcon} from "@heroicons/react/outline";
import {collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db, storage} from "../firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {userState} from "../atom/userAtom";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import ProfileModal from "./ProfileModal";
import {useRecoilState} from "recoil";
import {profileModalState} from "../atom/modalAtom";
import {AnimatePresence, motion} from "framer-motion";
import Post from "./Post";
import Link from "next/link";
import {timeConverter} from "../util/util";
// import {router} from "next/client";
import {useRouter} from "next/router"



export default function Profile(props) {
    const [currentUser,setCurrentUser]=useRecoilState(userState)
    const [open, setOpen] = useRecoilState(profileModalState);
    const [user, setUser] = useState({});
    const [tweets, setTweets] = useState([]);
    const [uid, setUid] = useState('');
    const [handleFollow,setHandleFollow]=useState(false)
    const auth = getAuth();
    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(auth.currentUser.providerData[0].uid)
                const fetchUser = async () => {
                    const docRef = doc(db, "users",props.id ? props.id : auth.currentUser.providerData[0].uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        //setCurrentUser(docSnap.data());
                        setUser
                        console.log('test',docSnap.data().timestamp.seconds)
                    }
                }
                fetchUser();
            }
        })
    },[open])

    // useEffect(()=>{
    //     // alert()
    //     if(!currentUser){
    //        router.push('/')
    //     }
    // },[currentUser])

    useEffect(
        () =>
            onSnapshot(
                query(collection(db, "posts"), orderBy("timestamp", "desc")),
                (snapshot) => {
                    setTweets(snapshot.docs);
                }
            ),
        []
    );

    const follow = () => {
        setHandleFollow(prevState => !prevState)
        const fetchUser = async () => {
            const docRef = doc(db, "users",uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let following = docSnap.data().following.concat(props.id)
                updateDoc(doc(db, "users", uid), {
                    following,
                })
            }
        }
        fetchUser()
        let followers = currentUser?.followers.concat(uid)
            updateDoc(doc(db, "users", props.id), {
                followers,
            })
    }

    return (
        <div
            className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
            <div className="flex py-2 px-3 sticky top-0 bg-white border-b border-gray-200">
                <div className="flex items-center">
                    <div className="hoverEffect flex items-center justify-center px-0 mr-auto w-9 h-9 mr-2">
                    <div className="hoverEffect" onClick={() => router.push("/")}>
                        <svg style={{height: 30}} viewBox="0 0 24 24" aria-hidden="true">
                            <g>
                                <path
                                    d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
                            </g>
                        </svg>
                        </div>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold cursor-pointer ml-4">{currentUser?.name}</h2>
                </div>
                <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
                    <SparklesIcon className="h-5"/>
                </div>
            </div>
            {currentUser &&
            <>
                <header style={{backgroundImage:`url(${currentUser?.headerImg})`}} className="h-[200px] h-full bg-[#B2B2B2] relative bg-cover">
                    <div className="w-[135px] h-[135px] bg-black rounded-full bg-white border-4 absolute top-32 left-4 border-3 border-white cursor-pointer overflow-hidden">
                        <img className="w-[100%]" src={currentUser?.userImg ? currentUser?.userImg : "/avatar.png"} alt="avatar"/>
                    </div>
                </header>
                <div className="flex xl:justify-end">
                    {props.id ?
                        <button onClick={follow} className="bg-black mt-4 mr-4 text-white px-4 pt-2 pb-2 mr-2 hover:bg-opacity-75 text-[15px] rounded-3xl font-bold">
                            {
                                handleFollow ?
                                    'Unfollow'
                                    :
                                    currentUser?.followers?.indexOf(uid) === -1 ? 'Follow' : 'Unfollow'
                            }
                        </button>
                        :
                        <button onClick={() => setOpen(true)} className="mt-4 mr-4 py-1 px-3.5 border-2 border-gray-200 font-bold rounded-3xl">
                            Edit profile
                        </button>
                    }
                </div>
                <div className="mt-6">
                    <h2 className="text-lg sm:text-xl font-bold cursor-pointer ml-4">{currentUser?.name}</h2>
                    <p className="text-[15px] text-gray-500 ml-4">@{currentUser?.username}</p>
                </div>
                {
                    currentUser?.bio && <p className="text-[15px] ml-4 mt-[12px]">{currentUser?.bio}</p>
                }

                <div className="flex items-center ml-4 mt-3">
                    {/*<input type="file"*/}
                    {/*       accept="image/*"*/}
                    {/*       onChange={updateImageProfile}*/}
                    {/*/>*/}
                    {/*<svg  viewBox="0 0 24 24" aria-hidden="true"*/}
                    {/*      className="w-[18px]">*/}
                    {/*    <g stroke={'gray'}>*/}
                    {/*        <path*/}
                    {/*            d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>*/}
                    {/*    </g>*/}
                    {/*</svg>*/}

                    {
                        currentUser?.location &&
                        <>
                            <svg viewBox="0 0 24 24" aria-hidden="true"
                                 className="w-[18px]">
                                <g>
                                    <path fill="#536471"
                                          d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
                                </g>
                            </svg>
                            <p className="text-[15px] text-gray-500 ml-1 mr-3">{currentUser?.location}</p>
                        </>

                    }

                    {
                        currentUser?.website &&
                        <>
                            <svg viewBox="0 0 24 24" aria-hidden="true"
                                 className="w-[18px]">
                                <g>
                                    <path fill="#536471"
                                          d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
                                </g>
                            </svg>
                            <a href={currentUser?.website} target="_blank" rel="noreferrer" className="text-[15px] text-gray-500 mr-3 ml-1 text-blue-600 cursor-pointer">
                                {currentUser?.website.replace(/https:\/\/|http:\/\//i,'')}
                            </a>
                        </>
                    }

                    <svg  viewBox="0 0 24 24" aria-hidden="true"
                          className="w-[18px]">
                        <g>
                            <path fill="#536471"
                                  d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
                        </g>
                    </svg>
                    <p className="text-[15px] text-gray-500 ml-1">{timeConverter(currentUser?.timestamp?.seconds)}</p>
                </div>
                <div className="flex items-center ml-4 mt-2.5 cursor-pointer">
                    <Link href="/following">
                    <p className="text-[15px] mr-[20px] text-[15px] text-gray-500 cursor-pointer hover:underline">
                        <span className="mr-1 font-bold text-black">{currentUser?.following?.length}</span>
                        Following
                    </p>
                    </Link>
                    <Link href="/followers">
                        <p className="text-[15px] text-[15px] text-gray-500 cursor-pointer hover:underline">
                            <span className="font-bold text-black w-[10px] mr-1">{currentUser?.followers?.length}</span>
                            Followers
                        </p>
                    </Link>

                </div>

            </>

            }
            <div>
                <AnimatePresence>
                    {tweets.map((item) => {
                        return (!currentUser || item?.data()?.id === currentUser?.uid) &&
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <Post bookmark key={item.id} id={item.id} post={item} />
                            </motion.div>
                    })}
                </AnimatePresence>
            </div>
            <ProfileModal
                name={currentUser?.name}
                bio={currentUser?.bio}
                location={currentUser?.location}
                website={currentUser?.website}
                userImg={currentUser?.userImg}
                headerImg={currentUser?.headerImg}
                id={currentUser?.uid}
            />
        </div>
    );
}
