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

export default function ProjectsPage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page>
      <Animation type="fadeUp">
          <Section anchor="projectsPage" heading="Personal Projects">
            <p>Waay too much to add here...</p>
          </Section>
        </Animation>
      </Page>
    </>
  );
}


