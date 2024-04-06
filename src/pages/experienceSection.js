import React from "react";
import { Link } from 'gatsby';
import {
    Section,
    Animation,
    Slider,
    data,
    classes
} from "gatsby-theme-portfolio-minimal";
import { Button, ButtonType } from "./_button"

export default function ExperienceSection() {
    return (
        <Animation type="fadeIn">
            <Section anchor="experienceSection" heading="Experience">
                <p>Still adding content...</p>
                <Animation margin-top = "4rem" text-align = "center" type="fadeIn"></Animation>
                    <Button
                        type={ButtonType.LINK}
                        externalLink={false}
                        url={"/experiencePage"}
                        label={"Explore More"}
                    />
            </Section >
        </Animation >
    );
}

