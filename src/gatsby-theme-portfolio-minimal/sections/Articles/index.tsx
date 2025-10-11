import React from 'react';
import { Animation } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/Slider';
import { ArticleCard, ArticleCardSkeleton } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/components/ArticleCard';
import { useLocalDataSource } from './data';
import { PageSection } from '../../../../node_modules/gatsby-theme-portfolio-minimal/src/types';
import * as classes from './style.module.css';

enum ArticleSource {
    Blog = 'blog',
}

interface ArticleSourceConfiguration {
    [ArticleSource.Blog]?: {
        valid: boolean;
    };
}

interface ArticlesSectionProps extends PageSection {
    sources: ArticleSource[];
}

export default function ArticleSection(props: ArticlesSectionProps): React.ReactElement {
    const response = useLocalDataSource();
    const [articles, setArticles] = React.useState<ArticleCard[]>([]);
    const configuration = validateAndConfigureSources(props.sources);

    async function collectArticlesFromSources(configuration: ArticleSourceConfiguration): Promise<ArticleCard[]> {
        const blogConfig = configuration[ArticleSource.Blog];
        const articleList: ArticleCard[] = [];

        if (blogConfig !== undefined) {
            const blogArticles = response.allArticle.articles;
            if (blogArticles.length > 0) {
                blogArticles.forEach((article) => {
                    articleList.push({
                        category: article.categories[0],
                        title: article.title,
                        publishedAt: new Date(article.date.replace(/-/g, '/')),
                        link: article.slug,
                        readingTime: article.readingTime.text,
                        image: article.banner || undefined,
                    });
                });
            }
        }

        return articleList.slice().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    React.useEffect(() => {
        (async function () {
            setArticles(await collectArticlesFromSources(configuration));
        })();
    }, []);

    return (
        <Animation type="fadeUp" delay={1000}>
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Articles]}>
                    {articles.length > 0
                        ? articles.slice(0, 3).map((article, key) => {
                              return <ArticleCard key={key} data={article} showBanner={Boolean(article.image)} />;
                          })
                        : [...Array(3)].map((_, key) => {
                              return <ArticleCardSkeleton key={key} />;
                          })}
                </Slider>
            </Section>
        </Animation>
    );
}

// validateAndConfigureSources: Sources for articles can be defined as props (e.g. sources=["Medium"])
// Currently, only Medium can be used as a source but it is thinkable to extend this approach to other
// sources (e.g. an integrated Markdown blog). To collect all articles from the source, there is a
// specific configuration needed for each source type. For example, to collect articles from Medium,
// we need the profile URL. This function is responsible for validating that at least one source is
// defined. It than adds the needed configuration properties to each source and returns the config.

function validateAndConfigureSources(sources: ArticleSource[]): ArticleSourceConfiguration {
    const configuration: ArticleSourceConfiguration = {};

    if (sources.length > 0) {
        // Medium support intentionally omitted in custom override to avoid extra static query.

        // Configure Blog (actually no real configuration is required yet)
        if (sources.map((i) => i.toLowerCase()).includes(ArticleSource.Blog)) {
            configuration[ArticleSource.Blog] = { valid: true };
        }
    } else {
        throw new Error('No Source for Articles defined.');
    }

    return configuration;
}
