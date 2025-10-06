const path = require(`path`);
const fs = require(`fs-extra`);
const svgToMiniDataURI = require('mini-svg-data-uri');
const { default: PQueue } = require('p-queue');
const { optimize } = require('svgo');


module.exports = ({ createResolvers, store, reporter, cache }) => {
    createResolvers({
        ArticleMarkdown: {
            body: { resolve: parentResolverPassthrough('html') },
            // Robustly resolve banner.src -> File without relying on @fileByRelativePath
            banner: {
                type: 'BannerImage',
                resolve: async (source, args, context) => {
                    const banner = source.banner;
                    if (!banner || !banner.src) return banner || null;
                    try {
                        const parentMd = context.nodeModel.getNodeById({ id: source.parent });
                        if (!parentMd) return { ...banner, src: null };
                        const fileNode = context.nodeModel.getNodeById({ id: parentMd.parent });
                        if (!fileNode) return { ...banner, src: null };
                        const baseDir = fileNode.dir || path.dirname(fileNode.absolutePath || '');
                        // Build a normalized absolute path that is consistent across OSes
                        const absPath = path.resolve(baseDir, banner.src);
                        const target = normalizePath(absPath);

                        // Some Gatsby setups may store absolutePath with different separators.
                        // To be robust, scan File nodes and compare normalized absolute paths.
                        const allFiles = context.nodeModel.getAllNodes({ type: 'File' }) || [];
                        const matched = allFiles.find((f) => normalizePath(f.absolutePath) === target) || null;

                        return { ...banner, src: matched };
                    } catch (e) {
                        reporter.warn(`Failed to resolve banner image for article ${source.slug}: ${e}`);
                        return { ...source.banner, src: null };
                    }
                },
            },
        },
        BannerImage: {
            src: {
                type: 'File',
                resolve: (source) => (source && source.src ? source.src : null),
            },
        },
        File: {
            svg: {
                type: 'InlineSvg',
                resolve: async (source) => await resolveSvgToInlineSvg({ source, store, reporter }),
            },
        },
    });
}; 

function parentResolverPassthrough(field, defaultValue) {
    return async function (source, args, context, info) {
        const fieldName = field || info.fieldName;
        const parentNode = context.nodeModel.getNodeById({ id: source.parent });
        const schemaType = info.schema.getType(parentNode.internal.type);
        const resolver = schemaType.getFields()[fieldName].resolve;
        const result = await resolver(parentNode, args, context, { fieldName });
        return result || defaultValue;
    };
}

// function parentPassthrough(field, defaultValue) {
//     return async function (source, args, context, info) {
//         const node = context.nodeModel.getNodeById({ id: source.parent });
//         const fields = field.split('.');
//         const value = fields.reduce((prev, key) => prev[key], node);
//         return value || defaultValue;
//     };
// }

/**
 * This is a modified version of the `gatsby-transformer-inline-svg` implementation.
 * Due to this issue: https://github.com/konstantinmuenster/gatsby-theme-portfolio-minimal/issues/39
 */

const queue = new PQueue({
    concurrency: 5,
});

function normalizePath(p) {
    if (!p) return '';
    // Replace backslashes with forward slashes
    return p.split('\\').join('/');
}

async function resolveSvgToInlineSvg({ source, store, reporter }) {
    const { absolutePath } = source;

    // Ensure to process only svgs
    if (source.internal.mediaType !== 'image/svg+xml') {
        return null;
    }

    return queueSVG({ absolutePath, store, reporter });
}

async function queueSVG({ absolutePath, store, reporter }) {
    return queue.add(async () => {
        try {
            return await processSVG({ absolutePath, store, reporter });
        } catch (err) {
            reporter.panic(err);
            return null;
        }
    });
}

async function processSVG({ absolutePath, store, reporter }) {
    const svg = await fs.readFile(absolutePath, 'utf8');

    if (svg.indexOf('base64') !== -1) {
        reporter.info(`${absolutePath}:\nSVG contains pixel data. Pixel data was removed to avoid file size bloat.`);
    }

    const result = optimize(svg.toString(), {
        path: absolutePath,
        multipass: true,
        floatPrecision: 2,
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        removeViewBox: false,
                    },
                },
            },
            'cleanupListOfValues',
            'prefixIds',
            'removeDimensions',
            'removeOffCanvasPaths',
            'removeRasterImages',
            'removeScriptElement',
            'convertStyleToAttrs',
            'removeStyleElement',
            'reusePaths',
            'sortAttrs',
        ],
    });

    if ('data' in result) {
        const dataURI = svgToMiniDataURI(result.data);
        const directory = store.getState().program.directory;

        return {
            content: result.data,
            originalContent: svg,
            dataURI,
            absolutePath,
            relativePath: path.relative(directory, absolutePath),
        };
    }

    if ('modernError' in result) {
        console.error(result.error);
        throw result.modernError;
    }

    throw new Error(`SVGO returned an invalid result:\n${JSON.stringify(result, null, 2)}`);
}
