# Getting Started
****Full Developer guide is located in IVA Confluence page: http://confluence.publicishealthcare.com/display/gilead/IVA+Development+Guide#create-a-slide-page**
### Installation
- You need to Install *Node.js*
    - On windows, download the installer from http://nodejs.org/download/
    - On Mac, you can either download the installer from http://nodejs.org/download/ or if you use Homebrew, do
    ```sh
    $ brew install node
    ```
- Once Node.js is installed, use Terminal to install *grunt-cli* using *npm*
    - ```sh
    $ npm install -g grunt-cli
    ```
- Then run *npm install* to download the dependencies for this project, *cd* to the same directory as this README.txt file
    - ```sh
    $ cd code/
    $ npm install
    ```
    
### Running the Project
#####Compile
The command **grunt** is used to compile the *.hbs* files to HTML files and will output the resulting built site to the *web/* directory. To do a build, run 
- ```sh
$ grunt
```
***Note**: You may need to run this command every time you modify the code.
    
There are two environments that you can use for building the site ***dev***, or ***prod***. The default environment is ***dev***. In order to change the target environment, please run 

- ```sh
    $ grunt --target=dev 
    $ grunt --target=prod
```
***Note**: This will affect the navigations URLs from Veeva, because pages are hosted on two different enviroments, and each URL per slide are different.
    
#####Zip
The command **grunt zip** is used to compile the project, take screenshots for all the slides, and compress each slide folder into a zip file. The output of this command will be on *zip/* directory.
- ```sh
    $ grunt zip 
```

### Create a Slide/Page
 For creating a new slide with *addNewSlide* file, please run this on your terminal
- ```sh
$ . addNewSlide <BRAND-NAME> <SLIDE-NAME>
```
*Please note that the order of the parameters is important*
    
    ***Example:***
    >   . addNewSlide stribild iva-stb-000-home <br>
    
### Folder Structure
All the code is inside ***src*** folder.

![folder structure](http://placehold.it/385x825)
#####Shared Assets
On this folder you will, find *styles*, *images*, *javascripts*, *json* of all the global layouts.
#####Shared Data
On this folder you will find, the whole menu/submenu configuration, as well as the root paths of all projects.
#####Shared Layouts
On this folder you will find, all the different handlebars layouts used on the site. You can create multiple layouts, and choose which one you want to use on each single page.
#####All Pages
All pages from the different brands are created inside this folder.
#####Single Page
Each single page is created on this folder, for further detail please check the section **[Create a Slide/Page](#create-a-slide-page)**
#####Shared content among pages
All the content that is repeated on almost all the pages like headers, menus, submenus, disclaimers are defined here. These files can be called/imported from the layouts or single pages.
#####Configuration scripts
All the files that *nodejs*, and *grunt* need to run the project are located here.
#####Web folder
Here you can find the compiled project after the **[grunt](#compile)** command
#####Zip Folder
Here you can find each slide of the project, zipped in separated files. This folder will be created after you run **[grunt zip](#zip)** command

### Slide/Page Structure
All the slides must have the following file structure:
```sh
iva-stb-000-home
├── assets
├── ├── css
├── ├── ├── styles.css
├── ├── img
├── ├── js
├── ├── ├── slide.js
├── index.hbs
```
***Note**: You can use **[this](#create-a-slide-page)** command to create the folder structure

#####*index.hbs*
This file must have the layout variables ─*at the top*, that specify the features that grunt will render on the slide. This is a list of the most common used variables:
- **layout**:  It represents the layout that the content of the page will belong at. it puts the entire content into the specific container of each layout
- **menu_item**: This is the name of the menu where the page belongs, it is mainly used to add an active state
- **sub_menu_options**:  The sub options that must be rendered, it is make like this way, since the same submenu can be reusable. it is used inside <%= %> because it is gotten from json configuration file, and it must be defined with that markers.
- **sub_menu_option_selected**:  Adds active state for the sub menu option selected.
- **isi**: This is used to insert the ISI into a custom page, these values are keys from isi.json, where it value represents a key over the json file, you can type a single key, and it will display the current text, you can type a parent node, and it will display the text from the whole children, also "own"  is a special key, where you can use it to append a custom ISI within the page, and "none" is used for avoid adding an ISI.
 
    ***Example:***
    ```
    ---
    layout: study-design.hbs
    menu_item:  efficacy
    sub_menu_options: <%=cfg.stribild.sub_nav_menu.efficacy%>
    sub_menu_option_selected: study design
    isi: isi-title,container-boxed-warning-start,boxed-warning,container-boxed-warning-end
    ide-header-logo : true 
    ---
    ```

### Zip Structure
All compressed slides have the following structure:
```
<Slide-name>_<Timestamp>
├── assets
├── ├── css
├── ├── img
├── ├── js
├── index.html
├── thumb.png
```

### Development Dependencies
- **Archiver** *v0.11.0* <br>
    A streaming interface for archive generation <br>
    [Documentation](https://github.com/ctalkington/node-archiver/)

- **Assemble** *v0.4.42* <br>
    Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages. <br>
    [Documentation](https://github.com/assemble/assemble)

- **async** *v0.9.0* <br>
    Higher-order functions and common patterns for asynchronous code <br>
    [Documentation](https://github.com/caolan/async) 

- **filewalker** *v0.1.2* <br>
    Fast and rock-solid asynchronous traversing of directories and files for node.js <br>
    [Documentation](https://github.com/oleics/node-filewalker")

- **grunt** *v0.4.5* <br>
    The JavaScript Task Runner <br>
    [Documentation](http://gruntjs.com/)

- **grunt-cache-breaker** *v1.0.1* <br>
    Simple cache-breaker, appends a timestamp or md5 hash to any urls <br>
    [Documentation](https://github.com/shakyshane/grunt-cache-breaker)

- **grunt-config** *v0.2.2* <br>
    Easy way to define specific target configuration. <br>
    [Documentation](http://github.com/outaTiME/grunt-config)

- **grunt-contrib-clean** *v0.5.0* <br>
    Clean files and folders. <br>
    [Documentation](https://github.com/gruntjs/grunt-contrib-clean)

- **grunt-contrib-copy** *v0.5.0* <br>
    Copy files and folders. <br>
    [Documentation](https://github.com/gruntjs/grunt-contrib-copy)

- **grunt-contrib-watch** *v0.6.1* <br>
    Run predefined tasks whenever watched file patterns are added, changed or deleted. <br>
    [Documentation](https://github.com/gruntjs/grunt-contrib-watch)

- **grunt-phantomjs-screenshot** *v0.1.2* <br>
    Takes screenshots of html files with phantomjs <br>
    [Documentation](https://github.com/orangenpresse/grunt-phantomjs-screenshot)

- **grunt-shell** *v1.1.1* <br>
    Run shell commands <br>
    [Documentation](https://github.com/sindresorhus/grunt-shell)

- **mkdirp** *v0.5.0* <br>
    Recursively mkdir, like `mkdir -p` <br>
    [Documentation](https://github.com/substack/node-mkdirp)

- **ncp** *v0.6.0* <br>
    Asynchronous recursive file copy utility. <br>
    [Documentation](https://github.com/AvianFlu/ncp)

- **node-minify** *v0.11.1* <br>
    Javascript / CSS minifier based on YUI Compressor / Google Closure Compiler / UglifyJS2 / Sqwish / Clean-css / CSSO <br>
    [Documentation](https://github.com/srod/node-minify)

- **touch** *v0.0.3* <br>
    like touch(1) in node <br>
    [Documentation](https://github.com/isaacs/node-touch)