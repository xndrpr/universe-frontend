'use client';

import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

async function getMovies() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies?offset=1&limit=50`,
    {
      cache: "force-cache"
    }
  );
  const data = await response.json();

  return data;
}

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function get() {
      const initialMovies = await getMovies();
      setMovies(initialMovies);
    }

    get();
  }, []);

  return (
    <div className="px-10">
      <Navbar setMovies={setMovies} />
      <div className="grid gap-4 grid-cols-fluid">
        {movies.map((movie: any) => (
          <div key={movie?.id | 0} className="overflow-auto">
            <Link href={`/movie/${movie.id}`}>
              <Image
                unoptimized
                className="w-full object-cover rounded-md transition hover:shadow-lg hover:opacity-75 cursor-pointer"
                alt="poster"
                src={movie?.poster?.previewUrl || "/placeholder.png"}
                width={200}
                height={300}
                style={{maxHeight: 250}}
              />
            </Link>
            <Link href={`/movie/${movie.id}`}>
              <div className="flex justify-between">
                <p>{movie?.name || "No Title"}</p>
                <p className="font-bold">{movie?.year || "No Year"}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
