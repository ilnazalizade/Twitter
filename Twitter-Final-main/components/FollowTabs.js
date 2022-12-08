import Link from "next/link";


export default function FollowTabs({activeTab}) {

    return (
            <div className="w-full h-[53px]  border-b border-gray-200 flex">
                <Link className="w-[50%] flex justify-center items-center text-[15px] font-medium cursor-pointer hover:bg-gray-200" href="/followers">
                        <p className={`${activeTab === 'followers' && 'border-b-blue-400 border-b-solid border-b-[4px]'} h-full pt-4`}>
                            Followers
                        </p>
                </Link>
                <Link className="w-[50%] flex justify-center items-center text-[15px] font-medium cursor-pointer hover:bg-gray-200" href="/following">
                    <p className={`${activeTab === 'following' && 'border-b-blue-400 border-b-solid border-b-[4px]'} h-full pt-4`}>
                        Following
                    </p>
                </Link>
            </div>
    )
}

