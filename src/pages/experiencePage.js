import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ExperienceSection from "./_experienceSection";

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


