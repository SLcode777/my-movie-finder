import Image from "next/image";


export function MovieCard({ title, year, imdbID, type, poster }) {
  return (
    <>
      <div className="card border border-stone-800 w-[312px] hover:shadow-md hover:shadow-yellow-400">
        <Image
          src={poster}
          alt="movie-poster"
          height={445}
          width={312}
          className="rounded-t-xl h-[445px]"
        />
        <h1 className="pt-2 px-4 font-bold text-lg truncate">{title}</h1>
        <p className="text-sm pl-4 pb-4 text-white/65">{year}</p>
      </div>
    </>
  );
}
