import {SparklesIcon} from "@heroicons/react/outline";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "../firebase";
import {AnimatePresence, motion} from "framer-motion";
import Post from "./Post";



export default function Bookmark() {
    const [bookmarks,setBookmarks] = useState([])
    const [loading,setLoading] = useState(true)
    useEffect(
        () =>
            onSnapshot(
                query(collection(db, "posts"), orderBy("timestamp", "desc")),
                (snapshot) => {
                    setBookmarks(snapshot.docs);
                    setLoading(false)
                }
            ),
        []
    );

    return (
        <div
            className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
            <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
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
                    <h2 className="text-lg sm:text-xl font-bold cursor-pointer ml-4">Bookmarks</h2>
                </div>
            </div>

            {!loading &&
                <>
                    {   bookmarks?.length > 0 ?
                        <div>
                            <AnimatePresence>
                                {bookmarks.map((item) => {
                                    return item?.data()?.isBookmarked &&
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 1 }}
                                        >
                                            {console.log('item',item)}
                                            <Post bookmark key={item.id} id={item.id} post={item} />
                                        </motion.div>
                                })}
                            </AnimatePresence>
                        </div>
                        :
                        <>
                            <div className="flex justify-center">
                                <img alt="" draggable="true"
                                     src="/book-in-bird.png"
                                     className="w-[366px] mt-10"/>

                            </div>
                            <div className="mx-auto mt-6 w-[300px]">
                                <h1 className="font-bold text-3xl">Save Tweets for later</h1>
                                <p className="text-gray-500 text-sm text-center mt-4">Don’t let the good ones fly away! Bookmark Tweets to easily find them again in the future.</p>
                            </div>
                        </>

                    }
                </>
            }
        </div>
    );
}
