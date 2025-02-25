"use client";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";

export default function BreadCrumbsColour() {
  const colors = ["foreground", "primary", "secondary", "success", "warning", "danger"];

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {colors.map((color) => (
        <Breadcrumbs key={color} color={color as "foreground" | "primary" | "secondary" | "success" | "warning" | "danger"}>
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
