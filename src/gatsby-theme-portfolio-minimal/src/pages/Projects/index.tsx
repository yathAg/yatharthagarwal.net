import React from 'react';
import { Animation } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { Button, ButtonType } from '../../components/Button';
import { Project } from '../../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Project';
import { PageSection } from 'gatsby-theme-portfolio-minimal/src/types';
import { useLocalDataSource, ProjectsSectionQueryResult } from './data';
import * as classes from './style.module.css';
import * as classes_new from './articlestyle.module.css';


interface ProjectsResult {
    projects: ProjectsSectionQueryResult[];
}


interface pageSection {
    sectionId: string;
    heading?: string;
    buttonVisible?: boolean;
    isPage?: boolean;
}

interface FilterOption {
    label: string;
    selected: boolean;
    // relatedArticleIds: string[];
}

export default function ProjectPageSection(props: pageSection): React.ReactElement {
    const response = useLocalDataSource();
    const data = response.allProjectsJson.sections[0];

    // const articles = props.pageContext.articles;
    const [filterOptions, setFilterOptions] = React.useState<FilterOption[]>(extractFilterOptions(data.projects));


    function handleFilterOptionClick(optionLabel: string): void {
        const updatedFilterOptions = [...filterOptions];
        const selectedOptionIndex = updatedFilterOptions.map((o) => o.label).indexOf(optionLabel);
        updatedFilterOptions[selectedOptionIndex].selected = !updatedFilterOptions[selectedOptionIndex].selected;
        setFilterOptions(updatedFilterOptions);
    }

    const filterSelected = filterOptions.map((o) => o.selected).indexOf(true) !== -1;

    return (
        <Animation type="fadeIn">
            <Section anchor={props.sectionId} heading={props.heading}>

                {/* <Slider additionalClasses={[classes.Options]}>
                    {filterOptions.map((option, key) => {
                        return (
                            <div
                                key={key}
                                role="button"
                                onClick={() => handleFilterOptionClick(option.label)}
                                className={[
                                    classes.Option,
                                    option.selected === true ? classes.Selected : null,
                                ].join(' ')}
                            >
                                {option.label} ({option.relatedArticleIds.length})
                            </div>
                        );
                    })}
                </Slider> */}

                <Slider additionalClasses={[classes_new.Options]}>
                    {filterOptions.map((project, key) => {
                        return (
                            <div
                                key={key}
                                role="button"
                                onClick={() => handleFilterOptionClick(project.label)}
                                className={[
                                    classes_new.Option,
                                    project.selected === true ? classes_new.Selected : null,
                                ].join(' ')}
                            >
                                {project.label}
                            </div>
                        );
                    })}
                </Slider>


                <Slider additionalClasses={[classes.Projects]}>
                    {data.projects
                        .filter((project) => filterSelected )
                        // .filter((project) => !filterSelected || selectedArticleIds.includes(article.id))
                        .map((project, key) => {
                            return (
                                <Project
                                    key={key}
                                    index={key}
                                    data={project}
                                />
                            );
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
//  Input ProjectsSec...var name projects...output type FilterOption
function extractFilterOptions(projects: Project[]): FilterOption[] {
    const filterOptions: FilterOption[] = [];
    const categoryList: string[] = [];
    projects.forEach((project) => {
        project.tags.forEach((tags) => {
            if (!categoryList.includes(tags)) {
                filterOptions.push({ label: tags, selected: false });
                categoryList.push(tags);
            } else {
                const optionIndex = filterOptions.map((o) => o.label).indexOf(tags);
                // filterOptions[optionIndex].relatedArticleIds.push(article.id);
            }
        });
    });
    return filterOptions;
}


// function extractFilterOptions(articles: ArticleTemplateData[]): FilterOption[] {
//     const filterOptions: FilterOption[] = [];
//     const categoryList: string[] = [];
//     articles.forEach((article) => {
//         article.categories.forEach((category) => {
//             if (!categoryList.includes(category)) {
//                 filterOptions.push({ label: category, selected: false, relatedArticleIds: [article.id] });
//                 categoryList.push(category);
//             } else {
//                 const optionIndex = filterOptions.map((o) => o.label).indexOf(category);
//                 filterOptions[optionIndex].relatedArticleIds.push(article.id);
//             }
//         });
//     });
//     return filterOptions.sort((a, b) => (a.relatedArticleIds.length > b.relatedArticleIds.length ? -1 : 1));
// }
