import '../styles/globals.css'
import '../components/style.css';
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import CommentModal from "../components/CommentModal";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router"



export default function App({ Component, pageProps: {  session, ...pageProps } }) {

  const [newsResults,setNewsResults] = useState(false)
  const [randomUsersResults,setRandomUsersResults] = useState(false)

  const router = useRouter()


  useEffect(()=>{

    axios.get('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json').then(res=>{
      setNewsResults(res.data)
      console.log(res)
    })

    axios.get('https://randomuser.me/api/?results=30&inc=name,login,picture').then(res=>{
      setRandomUsersResults(res.data)
    })

  },[])


  const getItem  = async() => {
    return axios.get('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
  }


  return (

  <SessionProvider session={session}>
    <RecoilRoot>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <main className={`flex min-h-screen mx-auto ${router.pathname === '/auth/signin' && 'justify-center'}`}>
          {/* Sidebar */}
          {
            router.pathname !== '/auth/signin' && <Sidebar />
          }


          <Component {...pageProps} />

          {/* Widgets */}
          {
            router.pathname !== '/auth/signin' && (newsResults && randomUsersResults) &&
            <Widgets newsResults={newsResults.articles}
                     randomUsersResults={randomUsersResults.results}
            />
          }



          {/* Modal */}
          <CommentModal />
        </main>
      </div>
  </RecoilRoot>
  </SessionProvider>

)}


//https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

export async function getServerSideProps() {
  const newsResults = await fetch(
      "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults = [];

  try {
    const res = await fetch(
        "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );

    randomUsersResults = await res.json();
  } catch (e) {
    randomUsersResults = [];
  }
  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}