import React from 'react';
import { Animation } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { Button, ButtonType } from '../../components/myButton';
import { Project } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Project';
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
    relatedArticleIds: string[];
}

export default function ProjectPageSection(props: pageSection): React.ReactElement {
    const response = useLocalDataSource();
    const originalData = response.allProjectsJson.sections[0]; // Store the original data
    const [data, setData] = React.useState(originalData); // Initialize data state with the original data
    const [buttonLabel, setButtonLabel] = React.useState("Explain it like I'm 10"); // Initialize button label state
    const [isLevelSelected, setLevelSelected] = React.useState(false);
    // const articles = props.pageContext.articles;
    const [filterOptions, setFilterOptions] = React.useState<FilterOption[]>(extractFilterOptions(data.projects));


    function handleFilterOptionClick(optionLabel: string): void {
        const updatedFilterOptions = [...filterOptions];
        const selectedOptionIndex = updatedFilterOptions.map((o) => o.label).indexOf(optionLabel);
        updatedFilterOptions[selectedOptionIndex].selected = !updatedFilterOptions[selectedOptionIndex].selected;
        setFilterOptions(updatedFilterOptions);
    }

    function handleLevelOptionClick(): void {
        const newData = data === originalData ? response.allProjectsJson.sections[1] : originalData;
        setData(newData); // Update the data state with the new data
        setButtonLabel(buttonLabel === "Explain it like I'm 10" ? "I'm grown up" : "Explain it like I'm 10");
        setLevelSelected(!isLevelSelected);
    }

    let selectedArticleIds: string[] = [];
    const filterSelected = filterOptions.map((o) => o.selected).indexOf(true) !== -1;
    if (filterSelected) {
        selectedArticleIds = filterOptions
            .filter((option) => option.selected) // Filter only for selected options
            .map((option) => option.relatedArticleIds) // Create an array of article ids arrays
            .flat(1) // Flatten the array to a string[]
            .filter((tags, index, arr) => arr.indexOf(tags) === index); // Remove duplicate article ids
    }

    return (
        <Animation type="fadeIn">
            <Section anchor={props.sectionId} heading={props.heading}>
                <div className={classes_new.Filter}>
                    Filter Projects By Category
                    <Slider additionalClasses={[classes_new.Options]}>
                        {filterOptions.map((option, key) => {
                            return (
                                <div
                                    key={key}
                                    role="button"
                                    onClick={() => handleFilterOptionClick(option.label)}
                                    className={[
                                        classes_new.Option,
                                        option.selected === true ? classes_new.Selected : null,
                                    ].join(' ')}
                                >
                                    {option.label}
                                </div>
                            );
                        })}
                        {/* <div
                            key={"button"}
                            role="button"
                            onClick={() => handleLevelOptionClick()}
                            className={[
                                classes_new.Option,
                                isLevelSelected ? classes_new.Selected : null,
                            ].join(' ')}
                        >
                            {buttonLabel}
                        </div> */}
                    </Slider>
                </div>

                <Slider additionalClasses={[classes.Projects]}>
                    {data.projects
                        // .filter((project) => filterSelected )
                        .filter((project) => !filterSelected || filterOptions.some((option) => option.selected && project.tags.includes(option.label)))

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

// function extractFilterOptions(projects: Project[]): FilterOption[] {
//     const filterOptions: FilterOption[] = [];
//     const categoryList: string[] = [];
//     projects.forEach((project) => {
//         project.tags.forEach((tags) => {
//             if (!categoryList.includes(tags)) {
//                 filterOptions.push({ label: tags, selected: false, relatedArticleIds: [project.tags] });
//                 categoryList.push(tags);
//             } else {
//                 const optionIndex = filterOptions.map((o) => o.label).indexOf(tags);
//                 filterOptions[optionIndex].relatedArticleIds.push(project.tags);
//             }
//         });
//     });
//     return filterOptions.sort((a, b) => (a.relatedArticleIds.length > b.relatedArticleIds.length ? -1 : 1));

// }

function extractFilterOptions(projects: Project[]): FilterOption[] {
    const filterOptions: FilterOption[] = [];
    const categorySet: Set<string> = new Set(); // Use a Set to keep track of unique tags
    projects.forEach((project) => {
        const firstTag = project.tags[0]; // Extracting the first tag
        if (!categorySet.has(firstTag)) { // Check if the tag is not already in the Set
            filterOptions.push({ label: firstTag, selected: false, relatedArticleIds: [firstTag] });
            categorySet.add(firstTag); // Add the tag to the Set
        }
    });
    return filterOptions.sort((a, b) => (a.label > b.label ? 1 : -1)); // Sort the filter options alphabetically
}

