import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ExperienceSection from "../gatsby-theme-portfolio-minimal/src/sections/Experience/index.tsx";

export default function ExperiencePage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page>
      <ExperienceSection sectionId="experiencePage" buttonVisible="false"/>
      </Page>
    </>
  );
}


