import {
    DotsHorizontalIcon,
  } from "@heroicons/react/outline";



export default function UserRow({user,id}) {




  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* image */}
<img className="h-11 w-11 rounded-full mr-4"
    src={user?.userImg} alt=""/>

       {/* Righ side */}
       <div className="flex-1">

         <div className="flex items-center justify-between">

          {/* user user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
          <h4 onClick={() => router.push(`/profile/${user?.id}`)} className="font-bold text-[15px] sm:text-[16px] hover:underline">{user?.name}</h4>
          <span className="text-sm sm:text-[15px]">@{user?.username} </span>
          </div>
           {/* dot icon */}
           <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
          </div>

           {/* user image */}
            <img
             onClick={() => router.push(`/users/${id}`)}
             className="rounded-2xl mr-2" src={user?.image} alt=""/>
      </div>
      </div>
  )
}
