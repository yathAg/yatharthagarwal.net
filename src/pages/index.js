import React from "react";
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
} from "gatsby-theme-portfolio-minimal";

export default function IndexPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <AboutSection sectionId="about" heading="About Me" />
        <ProjectsSection sectionId="features" heading="Projects" />
        <Animation type="fadeUp">
          <Section heading="Experience">
            <p>You can add your custom JSX here.</p>
          </Section>
        </Animation>
        <InterestsSection sectionId="details" heading="Interests" />
        <ContactSection sectionId="github" heading="Reach Out" />
      </Page>
    </>
  );
}
