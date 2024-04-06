import React from "react";
import { Link } from 'gatsby';
import {
  AboutSection,
  ArticlesSection,
  ContactSection,
  HeroSection,
  InterestsSection,
  Page,
  Section,
  Animation,
  ProjectsSection,
  Seo,
  Button,
  ButtonType,
  data,
  classes
} from "gatsby-theme-portfolio-minimal";
import ExperienceSection from "./experienceSection";


export default function IndexPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <AboutSection sectionId="about" heading="About Me" />
        <InterestsSection sectionId="details" heading="Interests" />
        <ProjectsSection sectionId="projects" heading="Projects" />
        <ExperienceSection />
      </Page>
    </>
  );
}
