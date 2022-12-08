import {SparklesIcon} from "@heroicons/react/outline";
import {useRecoilState} from "recoil";
import {userState} from "../atom/userAtom";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
import FollowTabs from "../components/FollowTabs";
import {collection, onSnapshot, query} from "firebase/firestore";
import {db} from "../firebase";
import UserRow from "../components/UserRow";


const Follow = ({tab}) => {
    const [loading,setLoading]=useState(true)
    const [currentUser,setCurrentUser]=useRecoilState(userState)
    const [users,setUsers] = useState([])
    

    useEffect(
        () =>
            onSnapshot(
                query(collection(db, "users")),
                (snapshot) => {
                    setUsers(snapshot.docs);
                    setLoading(false)
                }
            ),
        []
    );

    return (
        <div
            className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
            <div className="flex py-2 px-3 sticky top-0 bg-white">
                <div className="flex items-center">
                    <div className="hoverEffect flex items-center justify-center px-0 mr-auto w-9 h-9 mr-2">
                    <div className="hoverEffect" onClick={() => router.push("/profile")}>
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
            <FollowTabs activeTab={tab}/>
            {!loading &&
            <>
                {   users?.length > 0 ?
                    <div>
                        <AnimatePresence>
                            {users.map((item) => {
                                return currentUser[tab].indexOf(item.id) !== -1 &&
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <UserRow user={item.data()}/>
                                    </motion.div>
                            })}
                        </AnimatePresence>
                    </div>
                    :
                    <>
                        <div className="flex justify-center">
                            <img alt="" draggable="true"
                                 src="/yellow-birds.png"
                                 className="w-[366px] mt-10"/>

                        </div>
                        <div className="mx-auto mt-6 w-[400px]">
                            <h1 className="font-bold text-center text-3xl">Looking for {tab}?</h1>
                            <p className="text-gray-500 text-sm text-center mt-4">When someone follows this account, they’ll show up here. Tweeting and interacting with others helps boost {tab}.</p>
                        </div>
                    </>

                }
            </>
            }
        </div>
    )
}
export default Follow;
