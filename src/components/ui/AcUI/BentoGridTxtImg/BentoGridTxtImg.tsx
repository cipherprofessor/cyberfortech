"use client";

import React from "react";
import { LogoCluster } from "../logocluster";
import { BentoCard } from "./bentogrid";
import { ACUIMap } from "../map";
import { Keyboard } from "../keyboard";


// import { Keyboard } from "@/components/eldoraui/keyboard";
// import { BentoCard } from "@/components/eldoraui/bentocard";
// import { LogoCluster } from "@/components/eldoraui/logocluster";
// import { Map } from "@/components/eldoraui/map";

export function BentoGridtextImages() {
  return (
    <div className="m-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
      <BentoCard
        eyebrow="Insight"
        title="Get perfect clarity"
        description="Get a clear vision of cyber secturity , aws , front end and back end development. You will get to learn from the best in the industry."
        graphic={
          // eslint-disable-next-line tailwindcss/no-contradicting-classname
          <div className="h-80 bg-[url(https://www.tuv.com/content-media-files/germany/bs-industrial-service/landingpages/functional-safety-training-cyber-security/key-visuals/functional-safety-training-cyber-security-kv.jpg)] bg-[size:1000px_560px] bg-[left_-109px_top_-112px] bg-no-repeat" />
        }
        fade={["bottom"]}
        className="max-lg:rounded-t-4xl lg:rounded-tl-4xl lg:col-span-3"
      />
      <BentoCard
        eyebrow="Analysis"
        title="Get ahead of others in the industry"
        description="By joining our cources you will get to know about latest trends in the industry and get ahead of others. We will provide you with the best resources."
        graphic={
          // eslint-disable-next-line tailwindcss/no-contradicting-classname
          <div className="absolute inset-0 bg-[url(https://smartdev.com/wp-content/uploads/2024/01/0.-Smart-Solutions-Brighter-Futures-AWS-Reshaping-the-Educational-Landscape.png)] bg-[size:1100px_650px] bg-[left_-38px_top_-73px] bg-no-repeat" />
        }
        fade={["bottom"]}
        className="lg:rounded-tr-4xl lg:col-span-3"
      />
      <BentoCard
        eyebrow="Speed"
        title="Get all round technical knowledge"
        description="Get to know about all the technical aspects of the industry and get a hands on experience on the latest technologies."
        graphic={
          <div className="flex size-full pl-10 pt-10">
            <Keyboard highlighted={["LeftCommand", "C", "S"]} />
          </div>
        }
        className="lg:rounded-bl-4xl lg:col-span-2"
      />
      <BentoCard
        eyebrow="Source"
        title="Get to know how the big tech systems work"
        description="You will gain insights on how the big tech companies work and how they manage their systems."
        graphic={<LogoCluster />}
        className="lg:col-span-2"
      />
      <BentoCard
        eyebrow="Limitless"
        title="We have global reach"
        description="We have students from all over the world and we provide the best resources to all of them."
        graphic={<ACUIMap />}
        className="max-lg:rounded-b-4xl lg:rounded-br-4xl lg:col-span-2"
      />
    </div>
  );
}
