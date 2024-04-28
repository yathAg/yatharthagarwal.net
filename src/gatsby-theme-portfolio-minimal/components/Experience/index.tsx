import React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Animation } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { useMediaQuery } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/hooks/useMediaQuery';
import { Icon } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Icon';
import { ImageObject } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/types';
import * as classes from './style.module.css';

enum LinkType {
    External = 'external',
    Github = 'github',
}

export interface Experience {
    category?: string;
    title: string;
    duration: string;
    description: string;
    description2: string;
    image: ImageObject & { linkTo?: string };
    tags?: string[];
    links?: {
        type: LinkType;
        url: string;
    }[];
    visible: boolean;
}

interface ExperienceProps {
    data: Experience;
    index: number;
}

export function Experience(props: ExperienceProps): React.ReactElement {
    const isDesktopBreakpoint = useMediaQuery('(min-width: 992px)');

    return (
        <Animation
            type="fadeUp"
            className={classes.Experience}
            style={{
                flexDirection: isDesktopBreakpoint && props.index % 2 === 0 ? 'row-reverse' : undefined,
            }}
        >
            <div className={classes.Details}>
                <span className={classes.Category}>{props.data.category}</span>
                <h4 className={classes.Title}>{props.data.title}</h4>
                <span className={classes.Duration}>{props.data.duration}</span>
                <p>{props.data.description}<br /><br />{props.data.description2}</p>
                <div className={classes.Tags}>
                    {props.data.tags &&
                        props.data.tags.length !== 0 &&
                        props.data.tags.map((tag, key) => {
                            return (
                                <span key={key}>
                                    <u>{tag}</u>
                                </span>
                            );
                        })}
                </div>
                <div className={classes.Links}>
                    {props.data.links &&
                        props.data.links.length !== 0 &&
                        props.data.links.map((link, key) => {
                            return (
                                <a
                                    key={key}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="External Link"
                                >
                                    <Icon name={link.type} color="var(--subtext-color)" />
                                </a>
                            );
                        })}
                </div>
            </div>
            {props.data.image.src && props.data.image.linkTo && (
                <a href={props.data.image.linkTo} target="_blank" rel="noopener noreferrer" aria-label="External Link">
                    <GatsbyImage
                        className={classes.ExperienceImageWrapper}
                        imgClassName={classes.ExperienceImage}
                        objectFit={props.data.image.objectFit}
                        image={props.data.image.src.childImageSharp.gatsbyImageData}
                        alt={props.data.image.alt || `Experience ${props.data.title}`}
                    />
                </a>
            )}
            {props.data.image.src && !props.data.image.linkTo && (
                <GatsbyImage
                    className={classes.ExperienceImageWrapper}
                    imgClassName={classes.ExperienceImage}
                    objectFit={props.data.image.objectFit}
                    image={props.data.image.src.childImageSharp.gatsbyImageData}
                    alt={props.data.image.alt || `Experience ${props.data.title}`}
                />
            )}
        </Animation>
    );
}
