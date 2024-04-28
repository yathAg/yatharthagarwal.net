import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ExperienceSection from "../gatsby-theme-portfolio-minimal/sections/Experiences/index.tsx";

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


