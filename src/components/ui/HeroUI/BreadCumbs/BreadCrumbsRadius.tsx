"use client";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";

export default function BreadCrumbsRadius() {
  const radius: Array<"full" | "lg" | "md" | "sm" | "none"> = ["full", "lg", "md", "sm", "none"];

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {radius.map((r) => (
        <Breadcrumbs key={r} radius={r} variant="solid">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Music</BreadcrumbItem>
          <BreadcrumbItem>Artist</BreadcrumbItem>
          <BreadcrumbItem>Album</BreadcrumbItem>
          <BreadcrumbItem>Song</BreadcrumbItem>
        </Breadcrumbs>
      ))}
    </div>
  );
}
