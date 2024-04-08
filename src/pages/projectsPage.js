import React from "react";
import {
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";

import ProjectSection from "./_projectSection";

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


