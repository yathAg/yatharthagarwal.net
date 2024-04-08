import React from "react";
import {
  AboutSection,
  HeroSection,
  InterestsSection,
  Page,
  Seo
} from "gatsby-theme-portfolio-minimal";
import ExperienceSection from "./_experienceSection";
import ProjectSection from "./_projectSection";


export default function IndexPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <AboutSection sectionId="about" heading="About Me" />
        <InterestsSection sectionId="details" heading="Interests" />
        <ProjectSection sectionId="projects" heading="Projects" buttonVisible="true"/>
        <ExperienceSection sectionId="experience" heading="Experience" buttonVisible="true"/>
      </Page>
    </>
  );
}
