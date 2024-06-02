"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Input } from "@nextui-org/input";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import { Dispatch, useEffect, useRef, useState } from "react";

export const Navbar = ({ setMovies }: { setMovies: Dispatch<any> }) => {
  const [search, setSearch] = useState("");
  const typingTimeoutRef: any = useRef(null);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleUserStoppedTyping();
    }, 500);

    const handleUserStoppedTyping = async () => {
      if (!search || search.length <= 0) return;
      setMovies([]);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movies/search?limit=10&offset=1&query=${search}`,
        {
          cache: "force-cache"
        }
      );
      const data = await response.json();

      if (data) {
        setMovies(data);
      }
    };

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [search]);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      labelPlacement="outside"
      placeholder="Try The Matrix..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className=" max-w-fit" justify="start">
        <NavbarBrand as="li" className="gap-3">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Universe</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex w-full">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>{searchInput}</NavbarMenu>
    </NextUINavbar>
  );
};
