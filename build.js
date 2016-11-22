const Metalsmith = require('metalsmith')
const serve = require('metalsmith-serve')
const metadata = require('metalsmith-metadata')
const excerpts = require('metalsmith-excerpts')
const branch = require('metalsmith-branch')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const collections = require('metalsmith-collections')
const permalinks = require('metalsmith-permalinks')
const sass = require('metalsmith-sass')
const sitemap = require('metalsmith-mapsite')
const ignore = require('metalsmith-ignore')
const fingerprint = require('metalsmith-fingerprint')
const cleanCSS = require('metalsmith-clean-css')
const htmlMinifier = require('metalsmith-html-minifier')

Metalsmith(__dirname)
  .clean(true)
  .destination('./build')
  .use(excerpts())
  .use(collections({
    pages: {
        pattern: '*.md'
    },
    services: {
      pattern: '_services/*.md',
      sortBy: 'sortOrder'
    },
    person: {
      pattern: '_person/*.md',
      sortBy: 'numberId'
    },
    values: {
      pattern: '_values/*.md'
    },
    work: {
      pattern: 'work/*.md'
    },
    jobs: {
      pattern: 'jobs/*.md'
    },
    technologies: {
      pattern: 'technologies/*.md'
    }
  }))
  .use(markdown())
  .use(ignore([
    '**/_person/**',
    '**/_values/**',
    '**/_services/**'
  ]))
  .use(permalinks({
    pattern: './:directory',
    relative: false
  }))
  .use(sitemap({
    hostname:  'https://eastcoastproduct.com',
    omitIndex: true
  }))
  .use(sass({
    outputStyle: 'expanded',
  }))
  .use(cleanCSS({
    files: 'styles/*.css',
    cleanCSS: {
      rebase: false
    }
  }))
  .use(fingerprint({
    pattern: 'styles/*.css'
  }))
  .use(layouts({
    engine: 'ejs',
    directory: './templates/'
  }))
  .use(htmlMinifier())
  .use(serve({
    http_error_files: {
      404: "/error.html"
    }
  }))
  .build(function (err, files) {
    if(err) {
      console.log(err);
      process.exit(1);
    }
    console.log('Build success!');
    if (process.argv[2] && process.argv[2] === '--exit') process.exit(0);
  })
