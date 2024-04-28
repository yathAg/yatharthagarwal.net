import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ProjectPageSection from "../gatsby-theme-portfolio-minimal/pages/Projects/index.tsx";

export default function ProjectsPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page>
      <ProjectPageSection sectionId="projectsPage" buttonVisible="false"  isPage="false"/>
      </Page>
    </>
  );
}


