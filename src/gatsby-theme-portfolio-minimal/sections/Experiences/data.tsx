import { graphql, useStaticQuery } from 'gatsby';
import { Experience } from "../../components/Experience";

interface ExperiencesSectionQueryResult {
    allExperiencesJson: {
        sections: {
            button: {
                label: string;
                url: string;
                visible: boolean;
            };
            experiences: Experience[];
        }[];
    };
}

export const useLocalDataSource = (): ExperiencesSectionQueryResult => {
    return useStaticQuery(graphql`
        query ExperiencesSectionQuery {
            allExperiencesJson {
                sections: nodes {
                    button {
                        label
                        url
                        visible
                    }
                    experiences {
                        category
                        duration
                        description
                        image {
                            alt
                            linkTo
                            src {
                                childImageSharp {
                                    gatsbyImageData(width: 400)
                                }
                            }

                        }
                        tags
                        title
                        visible
                    }
                }
            }
        }
    `);
};
