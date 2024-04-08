import React from 'react';
import { Animation } from '../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { Button, ButtonType } from './_button';
import { Project } from '../../node_modules/gatsby-theme-portfolio-minimal/src/components/Project';
import { PageSection } from '../../node_modules/gatsby-theme-portfolio-minimal/src/types';
import { useLocalDataSource } from './_experiencedata';
import * as classes from './_experienceSection.module.css';

interface pageSection {
    sectionId: string;
    heading?: string;
    buttonVisible?: boolean;
}

export default function ExperienceSection(props: pageSection): React.ReactElement {
    const response = useLocalDataSource();
    const data = response.allProjectsJson.sections[1];

    return (
        <Animation type="fadeIn">
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Projects]}>
                    {data.projects.map((project, key) => {
                        return project.visible ? <Project key={key} index={key} data={project} /> : null;
                    })}
                </Slider>
                {data.button !== undefined && data.button.visible !== false && (
                    <Animation className={classes.MoreProjects} type="fadeIn">
                        <Button
                            type={ButtonType.LINK}
                            externalLink={false}
                            url={data.button.url}
                            label={data.button.label}
                            isPage={props.buttonVisible}
                        />
                    </Animation>
                )}
            </Section>
        </Animation>
    );
}
