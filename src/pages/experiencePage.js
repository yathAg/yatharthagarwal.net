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

export default function ExperiencePage() {
  return (
    <>
      <Seo title="Yatharth Agarwal" />
      <Page>
      <Animation type="fadeUp">
          <Section anchor="ExperiencePage" heading="Experiences">
            <p>Building...</p>
          </Section>
        </Animation>
      </Page>
    </>
  );
}


