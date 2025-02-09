"use client";

import React from "react";
import { LogoCluster } from "../logocluster";
import { BentoCard } from "./bentogrid";
import { ACUIMap } from "../map";
import { Keyboard } from "../keyboard";
import styles from './BentoGrid.module.scss';

export function BentoGridtextImages() {
  return (
    <div className={styles.bentoContainer}>
      <BentoCard
        eyebrow="Insight"
        title="Get perfect clarity"
        description="Get a clear vision of cyber secturity, aws, front end and back end development. You will get to learn from the best in the industry."
        graphic={
          <div className={`${styles.graphicImage} ${styles.securityImage}`} />
        }
        fade={["bottom"]}
        className={`${styles.card} ${styles.cardLarge} ${styles.topLeft}`}
      />
      <BentoCard
        eyebrow="Analysis"
        title="Get ahead of others in the industry"
        description="By joining our cources you will get to know about latest trends in the industry and get ahead of others. We will provide you with the best resources."
        graphic={
          <div className={`${styles.graphicImage} ${styles.awsImage}`} />
        }
        fade={["bottom"]}
        className={`${styles.card} ${styles.cardLarge} ${styles.topRight}`}
      />
      <BentoCard
        eyebrow="Speed"
        title="Get all round technical knowledge"
        description="Get to know about all the technical aspects of the industry and get a hands on experience on the latest technologies."
        graphic={
          <div className={styles.keyboardWrapper}>
            <Keyboard highlighted={["LeftCommand", "C", "S"]} />
          </div>
        }
        className={`${styles.card} ${styles.cardMedium} ${styles.bottomLeft}`}
      />
      <BentoCard
        eyebrow="Source"
        title="Get to know how the big tech systems work"
        description="You will gain insights on how the big tech companies work and how they manage their systems."
        graphic={<LogoCluster />}
        className={`${styles.card} ${styles.cardMedium}`}
      />
      <BentoCard
        eyebrow="Limitless"
        title="We have global reach"
        description="We have students from all over the world and we provide the best resources to all of them."
        graphic={<ACUIMap />}
        className={`${styles.card} ${styles.cardMedium} ${styles.bottomRight}`}
      />
    </div>
  );
}