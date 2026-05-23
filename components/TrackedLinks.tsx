"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import {
  trackDirectionsClicked,
  trackNeighborhoodClicked,
  trackShopDetailsClicked
} from "@/lib/analytics";

type InternalLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "href" | "onClick"> & {
  children: ReactNode;
  href: string;
};

type ShopLinkProps = InternalLinkProps & {
  neighborhood: string;
  shopSlug: string;
};

type ExternalShopLinkProps = Omit<ComponentPropsWithoutRef<"a">, "children" | "href" | "onClick"> & {
  children: ReactNode;
  href: string;
  neighborhood: string;
  shopSlug: string;
};

export function TrackedNeighborhoodLink({
  children,
  href,
  neighborhood,
  ...props
}: InternalLinkProps & { neighborhood: string }) {
  return (
    <Link {...props} href={href} onClick={() => trackNeighborhoodClicked(neighborhood)}>
      {children}
    </Link>
  );
}

export function TrackedShopDetailsLink({ children, href, neighborhood, shopSlug, ...props }: ShopLinkProps) {
  return (
    <Link {...props} href={href} onClick={() => trackShopDetailsClicked(shopSlug, neighborhood)}>
      {children}
    </Link>
  );
}

export function TrackedDirectionsLink({
  children,
  href,
  neighborhood,
  shopSlug,
  ...props
}: ExternalShopLinkProps) {
  return (
    <a {...props} href={href} onClick={() => trackDirectionsClicked(shopSlug, neighborhood)}>
      {children}
    </a>
  );
}
