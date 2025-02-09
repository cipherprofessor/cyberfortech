"use client";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";

export default function BreadCrumbsUnderline() {
  const underlines: Array<keyof typeof descriptions> = ["hover"];
  const descriptions = {
    // none: "No underline",
    hover: "Directory",
    // always: "Always underline",
    // active: "Underline on active",
    // focus: "Underline on focus",
  };

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {underlines.map((u) => (
        <div key={u}>
          <p className="mb-1 text-small text-default-600 capitalize">
            {descriptions[u]} ({u})
          </p>
          <Breadcrumbs underline={u}>
            <BreadcrumbItem>Cources</BreadcrumbItem>
            <BreadcrumbItem>CyberSecurity</BreadcrumbItem>
            <BreadcrumbItem>Advance Penetration Testing</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      ))}
    </div>
  );
}
