"use client";

import React, { useState } from "react";
import Movie from "../../../components/Movie/Movie";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

export default function MoviePage({ params }: { params: any }) {
  const id = params.id;
  const [movies, setMovies] = useState([]);

  return (
    <div>
      <Navbar setMovies={setMovies} />
      <div className="grid gap-4 grid-cols-fluid">
        {movies.map((movie: any) => (
          <div key={movie?.id | 0} className="overflow-auto">
            <Link href={`/movie/${movie.id}`}>
              <Image
                unoptimized
                className="w-full h-auto object-cover rounded-md transition hover:shadow-lg hover:opacity-75 cursor-pointer"
                alt="poster"
                src={movie?.poster?.previewUrl || "/placeholder.png"}
                width={200}
                height={300}
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
      <Movie id={id} />
    </div>
  );
}
