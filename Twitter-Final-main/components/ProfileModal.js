import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import { useRouter } from "next/router";


import {
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
} from "@heroicons/react/outline";
import {db, storage} from "../firebase";
import {
    addDoc,
    collection,
    collectionGroup,
    doc,
    onSnapshot,
    serverTimestamp, updateDoc,
} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import Moment from "react-moment";
import { profileModalState } from "../atom/modalAtom";
import EmojiPicker from "emoji-picker-react";
import {getDownloadURL, ref, uploadString} from "firebase/storage";



export default function ProfileModal(props) {
    const {currentUser} = props
    const [open, setOpen] = useRecoilState(profileModalState);
    const [name,setName] = useState('')
    const [bio,setBio] = useState('')
    const [locat,setLocat] = useState('')
    const [website,setWebsite] = useState('')
    const [userImg,setUserImg] = useState('')
    const [headerImg,setHeaderImg] = useState('')
    const filePickerRef = useRef(null);
    const headerPickerRef = useRef(null);


    useEffect(()=>{
        setName(props?.name)
        if(props?.bio) setBio(props?.bio)
        if(props?.location) setLocat(props?.location)
        if(props?.website) setWebsite(props?.website)
    },[open])


  const handleChange = (e) => {
      let {name,value} = e.target;
      if(name === 'name'){
          setName(value)
      }else if(name === 'bio'){
          setBio(value)
      }else if(name === 'location'){
          setLocat(value)
      }else if(name === 'website'){
          setWebsite(value)
      }
  }


    const updateProfile = () => {
        updateDoc(doc(db, "users", props.id), {
            location:locat,
            bio:bio,
            name:name,
            website:website,
        })
        setOpen(false)
    }

    const updateImageProfile = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setUserImg(readerEvent.target.result);
        }
    }

    const updateImageHeader = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setHeaderImg(readerEvent.target.result);
        }
    }

    useEffect(()=>{
        if(userImg){
            sendProfile()
        }
    },[userImg])

    useEffect(()=>{
        if(headerImg){
            sendHeaderImg()
        }
    },[headerImg])


    const imageRef = ref(storage, `profile/${props?.id}/image`);

    const headerRef = ref(storage, `header/${props?.id}/image`);

    const sendProfile = async () => {
        await uploadString(imageRef, userImg, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "users", props.id), {
                userImg: downloadURL,
            })
        });
    }

    const sendHeaderImg = async () => {
        await uploadString(headerRef, headerImg, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(doc(db, "users", props.id), {
                headerImg: downloadURL,
            })
        });
    }

    return (
        <div>
            {open && (
                <Modal
                    isOpen={open}
                    onRequestClose={() => setOpen(false)}
                    className="max-w-lg z-50 min-w-[400px] max-w-[80vw] w-[600px] min-h-[90vh] w-[90%]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
                >
                    <div className="p-1 z-50">
                        <div className="border-b border-gray-200 py-2 px-1.5 flex items-center justify-between">
                           <div className="flex items-center">
                               <div
                                   onClick={() => setOpen(false)}
                                   className="hoverEffect w-10 h-10 flex items-center justify-center"
                               >
                                   <XIcon className="h-[23px] text-gray-700 p-0" />
                               </div>
                               <h4 className="font-bold text-[15px] sm:text-[20px] ml-4">
                                   Edit profile
                               </h4>
                           </div>
                            <button onClick={updateProfile} className="bg-black text-white px-4 pt-1 pb-1 mr-2 hover:bg-opacity-75 text-[14px] rounded-3xl font-bold">Save</button>
                        </div>
                        <div style={{backgroundImage:`url(${headerImg ? headerImg : props.headerImg})`}} className="w-full h-[193px] bg-[#B2B2B2] flex justify-center items-center relative bg-cover">
                            {/*<img className="absolute" src="/back.jfif" alt=""/>*/}
                            <div onClick={() => headerPickerRef.current.click()} className="w-[44px] z-1 h-[44px] bg-[#56595C] rounded-full flex justify-center items-center cursor-pointer" title="add photo">
                                  <svg  fill="white" className="w-[22px]" viewBox="0 0 24 24" aria-hidden="true">
                                      <g>
                                          <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                                      </g>
                                  </svg>
                                  <input accept="image/*" ref={headerPickerRef} type="file" hidden onChange={updateImageHeader}/>
                              </div>

                            <div className="absolute -bottom-16 left-4 bg-black rounded-full w-[112px] h-[112px] overflow-hidden border-white border-4">
                                <img src={userImg ? userImg : props.userImg} alt="avatar"/>
                                <div  onClick={() => filePickerRef.current.click()} className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[44px] h-[44px] bg-[#56595C] rounded-full flex justify-center items-center cursor-pointer" title="add photo">
                                    <svg  fill="white" className="w-[22px]" viewBox="0 0 24 24" aria-hidden="true">
                                        <g>
                                            <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                                        </g>
                                    </svg>
                                    <input accept="image/*" ref={filePickerRef} type="file" hidden onChange={updateImageProfile}/>
                                </div>
                            </div>
                        </div>
                         <div className="mt-20 px-4">
                            <div className="input-container">
                                <input value={name} name="name" onChange={handleChange} className="w-full h-[56px] pl-[8px] pt-[16px] relative bg-[rgb(207, 217, 222)] rounded-[4px]" type="text"/>
                                <label className={name && 'filled'}>Name</label>
                            </div>
                            <div className="input-container mt-6">
                                <input value={bio}  name="bio" onChange={handleChange} className="w-full h-[56px] pl-[8px] pt-[16px] relative bg-[rgb(207, 217, 222)] rounded-[4px]" type="text"/>
                                <label className={bio && 'filled'}>Bio</label>
                            </div>
                            <div className="input-container mt-6">
                                <input value={locat} name="location" onChange={handleChange} className="w-full h-[56px] pl-[8px] pt-[16px] relative bg-[rgb(207, 217, 222)] rounded-[4px]" type="text"/>
                                <label className={locat && 'filled'}>Location</label>
                            </div>
                             <div className="input-container mt-6">
                                 <input value={website} name="website" onChange={handleChange} className="w-full h-[56px] pl-[8px] pt-[16px] relative bg-[rgb(207, 217, 222)] rounded-[4px]" type="text"/>
                                 <label className={website && 'filled'}>Website</label>
                             </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
