import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ProjectSection from "../gatsby-theme-portfolio-minimal/src/sections/Projects/index.tsx";

export default function ProjectsPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page>
      <ProjectSection sectionId="projectsPage" buttonVisible="false"/>
      </Page>
    </>
  );
}


