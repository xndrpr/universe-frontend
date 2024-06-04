"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Pagination } from "@nextui-org/pagination";
import { CircularProgress } from "@nextui-org/progress";
import s from "./Movie.module.css";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function Movie({ id }: { id: number }) {
  const [movie, setMovie] = useState<any>(null);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<any>(0);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(0);

  useEffect(() => {
    async function getInfo() {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`,
        { cache: "force-cache" }
      );
      setMovie(await response.json());
      setLoading(false);
    }
    getInfo();
  }, [id]);

  useEffect(() => {
    async function getPlayer() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/player/${id}`,
        { cache: "no-cache" }
      );
      const data = await response.json();
      if (data.type === "series") {
        const sortedData = data.data.map((season: any) => {
          return {
            ...season,
            series: season.series.sort(
              (a: any, b: any) => parseInt(a.seria, 10) - parseInt(b.seria, 10)
            ),
          };
        });
        setPlayerInfo({ ...data, data: sortedData });
      } else {
        setPlayerInfo(data);
      }
    }
    getPlayer();
  }, [id]);

  return (
    <div className={s.movieContainer}>
      <div>
        {loading ? (
          "Loading ..."
        ) : (
          <div>
            <h1 className="text-3xl font-bold">{movie?.name || "No Title"}</h1>
            <Image
              alt="poster"
              src={movie?.poster.previewUrl}
              width={200}
              height={300}
              className="rounded-2xl"
            />
            <div className="mt-4">
              <div className="flex gap-1">
                <b>Year:</b>
                {loading ? (
                  <CircularProgress aria-label="Loading..." />
                ) : (
                  movie?.year || "No Year"
                )}
              </div>
              <div className="flex gap-1">
                <b>Genres:</b>
                <div className="flex gap-1 flex-wrap">
                  {loading ? (
                    <CircularProgress aria-label="Loading..." />
                  ) : (
                    movie?.genres.map((genre: any, index: any) => (
                      <p key={index}>
                        {genre.name}
                        {index < movie.genres?.length - 1 ? "," : ""}
                      </p>
                    )) || "No genres"
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <b>Countries:</b>
                <div className="flex gap-1">
                  {loading ? (
                    <CircularProgress aria-label="Loading..." />
                  ) : (
                    movie?.countries.map((country: any, index: any) => (
                      <p key={index}>
                        {country.name}
                        {index < movie.countries?.length - 1 ? "," : ""}
                      </p>
                    )) || "No countries"
                  )}
                </div>
              </div>
            </div>
            <p className="mt-4">
              {loading ? (
                <CircularProgress aria-label="Loading..." />
              ) : (
                movie?.description || "No description"
              )}
            </p>
          </div>
        )}
        <div className="mt-14 pb-24 ">
          {playerInfo?.type === "series" ? (
            <div>
              <Tabs
                className={`${s.seasons} max-w-screen-sm overflow-auto flex flex-wrap`}
                aria-label="Options"
                selectedKey={selectedSeason}
                onSelectionChange={setSelectedSeason}
                variant="underlined"
              >
                {playerInfo?.data?.map((season: any, index: number) => (
                  <Tab key={index} title={`Season ${index + 1}`}></Tab>
                ))}
              </Tabs>
            </div>
          ) : null}
          <MediaPlayer title={movie?.name} src={
                  playerInfo?.type === "movie"
                    ? playerInfo?.data
                    : playerInfo?.data[selectedSeason]?.series[selectedEpisode === 0 ? 0 : selectedEpisode - 1]
                        ?.url
                }>
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </MediaPlayer>

          {playerInfo?.type === "series" ? (
            <Pagination
              total={playerInfo?.data[selectedSeason]?.series?.length || 0}
              aria-label="Options"
              loop
              showControls
              page={selectedEpisode}
              onChange={setSelectedEpisode}
              className="flex flex-wrap max-w-min overflow-auto"
              variant="light"
              size="sm"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
