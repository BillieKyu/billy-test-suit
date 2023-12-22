import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import { ParallaxProvider } from 'react-scroll-parallax';
import Image from 'next/image';
import { useRouter } from 'next/router';

import CardContent from "@/components/CardContent";
import Navbar from "@/components/Navbar";
import JudulPage from "@/components/JudulPage";

const setLocalStorageItem = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getLocalStorageItem = (key: string, defaultValue: any) => {
    if (typeof window !== 'undefined') {
      const storedItem = localStorage.getItem(key);
      try {
        return storedItem ? JSON.parse(storedItem) : defaultValue;
      } catch (error) {
        console.error(`Error parsing JSON for key ${key}:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };
  
export default function MainPage({ ideas, startItemKey  }: any) {
    const router = useRouter();
    const { query } = router;
  
    const storedPerPage = getLocalStorageItem('perPage', 10);
    const storedSortBy = getLocalStorageItem('sortBy', '-published_at');
    const storedCurrentPage = getLocalStorageItem('currentPage', 1);
    const storedActivePage = getLocalStorageItem('activePage', 1);
  
    const [perPage, setPerPage] = useState<number>(
      query.perPage ? Number(query.perPage) : storedPerPage
    );
    const [sortBy, setSortBy] = useState<"published_at" | "-published_at">(
      query.sortBy ? (query.sortBy as "published_at" | "-published_at") : storedSortBy
    );
    const [currentPage, setCurrentPage] = useState<number>(
      query.pageNumber ? Number(query.pageNumber) : storedCurrentPage
    );
    const [data, setData] = useState(ideas);
    const [activePage, setActivePage] = useState<number>(storedActivePage || currentPage);
    const [startItem, setStartItem] = useState<string>(startItemKey);
  
    useEffect(() => {
      setLocalStorageItem('perPage', perPage);
    }, [perPage]);
  
    useEffect(() => {
      setLocalStorageItem('sortBy', sortBy);
    }, [sortBy]);
  
    useEffect(() => {
      setLocalStorageItem('currentPage', currentPage);
    }, [currentPage]);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${perPage}&append[]=small_image&append[]=medium_image&sort=${sortBy}`
            );
            setData(response.data);
            if (!startItem && response.data?.data?.length > 0) {
              setStartItem(response.data.data[0].id);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        const totalPages = Math.ceil(ideas.meta.total / perPage);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        } else {
          fetchData();
        }
      }, [perPage, sortBy, currentPage, startItem]);
  
    useEffect(() => {
      router.push({
        pathname: router.pathname,
        query: { perPage, sortBy, pageNumber: currentPage },
      });
      setLocalStorageItem('startItemKey', startItem);
    }, [perPage, sortBy, currentPage, startItem]);
  
    const handlePerPageChange = (perPageValue: number) => {
      setPerPage(perPageValue);
    };
  
    const handleSortChange = (sortValue: "published_at" | "-published_at") => {
      setSortBy(sortValue);
    };
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      setActivePage(pageNumber);
      setLocalStorageItem('activePage', pageNumber);
    };
  
    const generatePages = () => {
        const pages = [];
        const totalPages = Math.ceil(ideas.meta.total / perPage);
    
        const maxPages = 5;
        let startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
        let endPage = Math.min(startPage + maxPages - 1, totalPages);
    
        if (totalPages <= maxPages) {
          startPage = 1;
          endPage = totalPages;
        } else if (endPage - startPage < maxPages - 1) {
          startPage = endPage - maxPages + 1;
        }
    
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        return { pages, activePage: currentPage };
      };
  return (
    <main>
      <Navbar />

      <ParallaxProvider>
        <JudulPage judul="Ideas" />
      </ParallaxProvider>

      <div className="mx-36 w-10/12 mt-6">
        <div className="flex flex-row items-center justify-between">
          <p className="font-medium">
            Showing {currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1} - {" "}
            {Math.min(currentPage * perPage, ideas.meta.total)} of{" "}
            {ideas.meta.total}
          </p>

          <div className="flex flex-row items-center gap-x-6 font-medium">
            <div className="flex flex-row item-center gap-x-2">
              <p>Show per page: </p>
              <select
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="border-2 w-24 rounded-lg"
                value={perPage}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex flex-row item-center gap-x-2">
              <p>Sort by: </p>
              <select
                onChange={(e) =>
                  handleSortChange(e.target.value as "published_at" | "-published_at")
                }
                className="border-2 w-24 rounded-lg"
                value={sortBy}
              >
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <CardContent ideas={data.data} />

        <div className="flex items-center justify-center mt-8">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1"
          >
            <Image src="/double_arrow.svg" alt="next" width={30} height={30} />
          </button>

          <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 transform rotate-180"
                >
                    <Image src="/single_arrow.svg" alt="previous" width={30} height={30} />
                </button>

                {generatePages().pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              generatePages().activePage === page ? 'bg-[#ff6600] text-white' : ''
            }`}
          >
            {page}
          </button>
        ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(ideas.meta.total / perPage)}
                    className="mx-1 px-3 py-1"
                >
                    <Image src="/single_arrow.svg" alt="next" width={30} height={30} />
                </button>

                <button
                    onClick={() => handlePageChange(Math.ceil(ideas.meta.total / perPage))}
                    disabled={currentPage === Math.ceil(ideas.meta.total / perPage)}
                    className="mx-1 px-3 py-1 transform rotate-180"
                >
                    <Image src="/double_arrow.svg" alt="next" width={30} height={30} />
                </button>

        </div>
      </div>

      <div className="my-10 text-transparent">a</div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(
      "https://suitmedia-backend.suitdev.com/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=-published_at",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    return {
      props: {
        ideas: data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        ideas: [],
      },
    };
  }
};