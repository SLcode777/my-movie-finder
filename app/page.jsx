"use client";

import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import { useEffect, useState, Suspense } from "react";
import useSWR from "swr";
import React from "react";
import { MovieCard } from "./movie-card";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Home() {
  const [search, setSearch] = useQueryState("search");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [urlSearch, setUrlSearch] = useState(null);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearch) {
      setSearch(debouncedSearch);

      let apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        apiKey = prompt("entrez votre clé API svp");
        if (apiKey) {
          localStorage.setItem("apiKey", apiKey);
        }
      }

      const urlSearch = `/?s=${search}&apikey=${apiKey}`;
      setUrlSearch(urlSearch);
    }
  }, [debouncedSearch]);

  const { data, error, isLoading } = useSWR(
    urlSearch ? `https://www.omdbapi.com/${urlSearch}` : null,
    fetcher
  );

  return (
    
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-top p-24 bg-black">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold  text-yellow-400 mb-20">
          Movie Finder
        </h1>
        <form>
          <fieldset className="border border-stone-800 p-6 rounded-lg mb-20">
            <legend className="text-yellow-500 italic">
              &nbsp;&nbsp;Search&nbsp;&nbsp;
            </legend>
            <input
              value={search}
              onChange={handleInputChange}
              type="text"
              placeholder="Type here"
              className="input input-bordered bg-stone-800 border-stone-800 w-full min-w-96 "
            />
            <div className="text-sm pt-1 text-white/55 italic">
              enter this API key when prompted : 317bb652
            </div>
          </fieldset>
        </form>
      </div>
      <div>
        {error ? <p>an error occured... </p> : null}
        {isLoading ? (
          <span className="loading loading-ring loading-lg"></span>
        ) : null}
        {data && data.Response === "False" ? (
          <p className="text-red-500">No results found for {search}</p>
        ) : null}
        {data && data.Search ? (
          <ul className="grid grid-cols-3 gap-2">
            {data.Search.map((movie) => (
              <li key={movie.imdbID}>
                <MovieCard
                  title={movie.Title}
                  poster={movie.Poster !== "N/A" ? movie.Poster : "/default-poster.png"}
                  year={movie.Year}
                  type={movie.Type}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
    
  );
}

export default function App() {
  return (
    <Suspense fallback={<span className="loading loading-ring loading-lg"></span>}>
      <Home/>
    </Suspense>
  )
}