import React from 'react';
import { Animation } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { Button, ButtonType } from '../../components/myButton';
import { Experience } from '../../components/Experience';
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
    const data = response.allExperiencesJson.sections[0];

    return (
        <Animation type="fadeIn">
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Projects]}>
                    {data.experiences.map((experience, key) => {
                        return props.isPage ? (experience.visible ? <Experience key={key} index={key} data={experience} /> : null) 
                            : (<Experience key={key} index={key} data={experience} />);
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
