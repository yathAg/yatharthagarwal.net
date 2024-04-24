import React from 'react';
import { Animation } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { Button, ButtonType } from '../../components/Button';
import { Project } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Project';
import { PageSection } from 'gatsby-theme-portfolio-minimal/src/types';
import { useLocalDataSource } from './data';
import * as classes from './style.module.css';


interface pageSection {
    sectionId: string;
    heading?: string;
    buttonVisible?: boolean;
    isPage?: boolean;
}

export default function ExperienceSection(props: pageSection): React.ReactElement {
    const response = useLocalDataSource();
    const data = response.allProjectsJson.sections[1];

    return (
        <Animation type="fadeIn">
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Projects]}>
                    {data.projects.map((project, key) => {
                        return props.isPage ? (project.visible ? <Project key={key} index={key} data={project} /> : null) 
                            : (<Project key={key} index={key} data={project} />);
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
