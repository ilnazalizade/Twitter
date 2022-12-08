import { SearchIcon } from "@heroicons/react/solid";
import TrendingTest from "./TrendingTest";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Trending({ trendingResults }) {
  const [articleNum, setArticleNum] = useState(3);
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      {/* <div className=" w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full bg-red-300 relative">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadown-lg focus:bg-white bg-gray-100" type="text" placeholder="Search Twitter" />
        </div>
      </div> */}
      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[100%]">
        <h4 className="font-bold text-xl px-4">Trends</h4>
        <AnimatePresence>
          {trendingResults.slice(0, articleNum).map((article) => (
            <motion.div key={article.title} intial={{opacity: 0}} 
          animate={{opacity: 1}} exit={{opacity: 0}}
          transition={{duration: 1}}>
              <TrendingTest key={article.title} article={article} />
         </motion.div>
          ))}
        </AnimatePresence>
        {/* {trendingResults.map((article) => (
            <p>{article.title}</p>
        ))} */}
        <button onClick={() => setArticleNum(articleNum + 3)} className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >Show More</button>
      </div>
    </div>
  );
}