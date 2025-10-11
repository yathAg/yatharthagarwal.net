import React from "react";
import {
  AboutSection,
  HeroSection,
  InterestsSection,
  Page,
  ArticlesSection,
  Seo
} from "gatsby-theme-portfolio-minimal";
import ExperienceSection from "../gatsby-theme-portfolio-minimal/sections/Experiences/index.tsx";
import ProjectSection from "../gatsby-theme-portfolio-minimal/sections/Projects/index.tsx";


export default function IndexPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <AboutSection sectionId="about" heading="About Me" />
        <InterestsSection sectionId="details" heading="Interests"  buttonVisible="true" isPage="false"/>
        <ProjectSection sectionId="projects" heading="Projects" buttonVisible="true" isPage="false"/>
        <ExperienceSection sectionId="experience" heading="Experience" buttonVisible="true" isPage="false"/>
        <ArticlesSection sectionId="articles" heading="Recent Blogs" sources={['Blog']} />
      </Page>
    </>
  );
}
