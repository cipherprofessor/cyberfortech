"use client";
import {Chip} from "@heroui/react";

export default function ChipVariants() {
  return (
    <div className="flex gap-4">
      <Chip color="warning" variant="solid">
        Solid
      </Chip>
      <Chip color="warning" variant="bordered">
        Bordered
      </Chip>
      <Chip color="warning" variant="light">
        Light
      </Chip>
      <Chip color="warning" variant="flat">
        Flat
      </Chip>
      <Chip color="warning" variant="faded">
        Faded
      </Chip>
      <Chip color="warning" variant="shadow">
        Shadow
      </Chip>
      <Chip color="warning" variant="dot">
        Dot
      </Chip>
    </div>
  );
}
