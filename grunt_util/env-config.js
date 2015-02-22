// Directory names
var _dir = {
    src: "src",
    layout: "layouts",
    partials: "partials",
    data: "data",
    web: "web",
    project: "slides", /*Change this on future projects*/
    pages: "pages",
    assets: "assets",
    global: "global",
    zip: "zip",
    css: "css",
    js: "js"

}

//File names
var _file = {
    layout: "default.hbs",
    cssOutput: "all-styles.css",
    jsOutput: "all-js.js",
    cachebreaker: [
        'css/all-styles.css',
        'js/all-js.js'
    ],
    compileCSS: [
        'global/css/reset.css',
        'global/css/template.css',
        'css/styles.css'
    ],
    compileJS: [
        'global/js/jquery.min.js',
        'global/js/jquery.colorbox.js',
        'global/js/veeva-library-3.2.js',
        'global/js/fastclick.js',
        'global/js/dh-veeva-utils.js',
        'global/js/bouncefix.min.js',
        'global/js/main.js',
        'js/slide.js'
    ]
}

//Patterns used on the project
var _patterns = {
    partials: "**/*.hbs",
    data: "*.json",
    pages: "**/*.hbs",
    assets: "**/assets/**",
    thumb: "**/thumb.png",
    cachebreaker: "**/index.html",
    screenshot: ["**/**/*.html"],
    watch: ['src/**/*'],
    cleanAll: [
        'web/**',
        'zip/**'
    ],
    cleanAsssets: [
        'web/**/**/assets/global/css',
        'web/**/**/assets/global/js',
        'web/**/**/assets/css/styles.css',
        'web/**/**/assets/js/slide.js'
    ],
    cleanBuild: ['web/**/src'],

}

//Server settings
var _server = {
    port: 9001,
    protocol: 'http',
    hostname: "localhost",
    base: joinPath( [_dir.web, _dir.project, ""] ),
    livereload: 1337
}

//Build the esch path.
//It can return a String or an Array
function joinPath(arr, flagToArray) {
    if (flagToArray) {
        return [arr.join("/")];
    } else {
        return arr.join("/");
    }
}

//Concatenate a base URL to each item on an array. It return a new Array
function mapArray(arr, base) {
    return arr.map(function(item, index) {
        return (base? joinPath( [base, item] ) : joinPath( [item] ))
    });
}

var Config = {

    /******Asemble******/
    DIR_LAYOUT: joinPath( [_dir.src, _dir.layout] ),

    FILE_LAYOUT: joinPath( [_file.layout] ),

    PATTERN_PARTIALS: joinPath( [_dir.src, _dir.partials, _patterns.partials] ),

    PATTERN_DATA: joinPath( [_dir.src, _dir.data, _patterns.data] ),

    PATTERN_PAGES: joinPath( [_dir.src, _dir.pages, _dir.project, _patterns.pages], true),

    DIR_PAGES_DEST: joinPath( [_dir.web, _dir.project, ""] ),

    /******Copy******/
    PATTERN_ASSETS: mapArray([_patterns.assets, _patterns.thumb], joinPath( [_dir.pages, _dir.project] )),

    DIR_ASSETS_DEST: joinPath( [_dir.web, _dir.project, _dir.src, ""] ),

    DIR_BUILD_SRC: joinPath( [_dir.web, _dir.project, _dir.src, _dir.pages, _dir.project] ),

    /******Dupe Assets******/
    DIR_GLOBAL: joinPath( [_dir.assets, _dir.global, ""] ),

    /******Cachebreaker******/
    FILE_CACHEBREAKER: mapArray(_file.cachebreaker, _dir.assets),

    PATTERN_CACHEBREAKER: joinPath( [_dir.web, _patterns.cachebreaker], true),

    /******Zip******/
    DIR_ZIP_DEST: joinPath( [_dir.zip, _dir.project, ""] ),

    /******Compile******/
    FILE_CSS_SRC: mapArray(_file.compileCSS, _dir.assets),

    DIR_CSS_DEST: joinPath( [_dir.assets, _dir.css] ),

    FILE_CSS_DEST: joinPath( [_file.cssOutput] ),

    FILE_JS_SRC: mapArray(_file.compileJS, _dir.assets),

    DIR_JS_DEST: joinPath( [_dir.assets, _dir.js] ),

    FILE_JS_DEST: joinPath( [_file.jsOutput] ),

    /******Screenshot******/
    PATTERN_SCREENSHOT: joinPath( [_patterns.screenshot] ),

    /****** Watch******/
    PATTERN_WATCH: joinPath( [_patterns.watch] ),

    /******Clean******/
    PATTERN_CLEAN_ALL: mapArray(_patterns.cleanAll),

    PATTERN_CLEAN_ASSETS: joinPath( [_patterns.cleanAsssets] ),

    PATTERN_CLEAN_BUILD: joinPath( [_patterns.cleanBuild] ),

    /******Util******/
    DIR: _dir,

    SERVER: _server

};

// console.log(Config);

module.exports = Config;