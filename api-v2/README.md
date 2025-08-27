# SOUM Backend API with TypeScript

# Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Code Quality and Code Security with SonarQube](#code-quality-and-code-security-with-sonarQube)
- [Deploying the app](#deploying-the-app)
  - [Pre-reqs](#Prerequisites)
- [TypeScript + Node](#typescript--node)
  - [Getting TypeScript](#getting-typescript)
  - [Project Structure](#project-structure)
  - [Building the project](#building-the-project)
  - [Type Definition (`.d.ts`) Files](#type-definition-dts-files)
  - [Debugging](#debugging)
  - [Testing](#testing)
  - [ESLint](#eslint)
- [Dependencies](#dependencies)
  - [`dependencies`](#dependencies)
  - [`devDependencies`](#devdependencies)

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started

- Install dependencies

```
cd <project_name>
npm install
```

- Configure your mongoDB server

```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db

# starting from macOS 10.15 even the admin cannot create directory at root
# so lets create the db directory under the home directory.

mkdir -p ~/data/db
# user account has automatically read and write permissions for ~/data/db.
```

- Start your mongoDB server (you'll probably want another command prompt)

```bash
mongod

# on macOS 10.15 or above the db directory is under home directory
mongod --dbpath ~/data/db
```

- Build and run the project

```
npm run build
npm start
```

Or, if you're using VS Code, you can use `cmd + shift + b` to run the default build task (which is mapped to `npm run build`), and then you can use the command palette (`cmd + shift + p`) and select `Tasks: Run Task` > `npm: start` to run `npm start` for you.

> **Note on editors!** - TypeScript has great support in [every editor](http://www.typescriptlang.org/index.html#download-links), but this project has been pre-configured for use with [VS Code](https://code.visualstudio.com/).
> Throughout the README We will try to call out specific places where VS Code really shines or where this project has been set up to take advantage of specific features.

Finally, navigate to `http://localhost:3000` and you should see the template being served and rendered locally!

# Code Quality and Code Security with SonarQube

The repository use the community version of SonarQube for free, so, it doesn't have [Intergration with Gitlab](https://www.sonarqube.org/gitlab-integration/) which is available in Commercial Editions. The developers need to set up SonarQuebe Server on their local machine and run scanner to make sure the code quality and security is good before committing code to the repo. You also need to add SonarLint extension to your IDE.

## SonarLint

SonarLint is a free extension that helps you fix quality and security issues when you code, provides real time feedback and clear remediation guidance. The extension is available for major IDEs such as JetBrains, Eclipse, Visual Studio and Visual Code. We use Visual Code as our main IDE, I just mention about VC extension.

- Click on this [SonarLint extension](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode) or you can search for the word `sonarlint` in VC Extensions tab
- Install it and restart the IDE

## SonarQuebe Server

You need to install a local server where you can get a informative dashboard SonarQuebe bring on the table

If you are using Windows and Linux/amd64, the setup is straightforward, just follow this [Try Out SonarQuebe](https://docs.sonarqube.org/latest/setup/get-started-2-minutes/)
I recommend you install a local server using its Docker Image

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
```

Once your instance is up and running, Log in to http://localhost:9000 using System Administrator credentials:

login: admin
password: admin

### Important Note for Apple M4

As the time of writing, SonarQube doesn't support arm64 arch officially, if you use Apple Mac M1, you need to do the extra steps

1. At the root of this repo folder, type `cd sonar_arm64`
2. Type `docker build . -t sonarquebe:8.9`
3. Start Docker container:

```
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000  sonarqube:8.9
```

That's it, you can login to http://localhost:9000

### Analyzing our project

After you are logged in to your local SonarQuebe, you need to do the following steps

1. Click the **Create new project** button

2. Type `soum-api-v2` for **Project key** and **Display name**, then click the **Set Up** button
3. Under **Provide a token**, type `api-v2`, click **Generate** button, and click **Continue**
4. Under Run analysis on your project, choose _Other_ for What option best describes your build?, and choose your OS for the next question _What is your OS_
5. Copy the generated sonar-scanner command that you will use later to make SonarQUebe scan all the code and report on your local SonarQuebe Server

## SonarQuebe Scanner

You can download from [SonarScanner](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
You can run sonarScanner from a zip file or from a Dicker image. I run from a zip file, I extract the zip, add this extracted folder's `/bin` folder to your PATH
Then you can run the sonar-scanner command that generated above. The command is similar to the one I use

```
sonar-scanner \
  -Dsonar.projectKey=soum-api-v2 \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=22494a3ddc6eac941fab340ac5cac8d1d4298cc4 \
  -Dsonar.projectBaseDir=[full-path-to-the-folder]/api-v2
```

When the scanner is done, you can go to [SonarQuebe Server](http://localhost:9000/dashboard?id=soum-api-v2) to read the result

# Deploying the app

There are many ways to deploy a Node app, and in general, nothing about the deployment process changes because you're using TypeScript.
In this section, I'll walk you through how to deploy this app to Azure App Service using the extensions available in VS Code because I think it is the easiest and fastest way to get started, as well as the most friendly workflow from a developer's perspective.

- **Create a cloud database** -
  For local development, running MongoDB on localhost is fine, however once we deploy we need a database with high availability.
  The easiest way to achieve this is by using a managed cloud database.
  There are many different providers, but the easiest one to get started with is [MongoDB Atlas](#create-a-managed-mongodb-with-atlas).
- **SendGrid Account** -
  If you don't have one, you can sign up for free, we will need it to send emails. There are many different providers that Nodemailer supports ([Well-known services](https://nodemailer.com/smtp/well-known/)), we'll be using [SendGrid](#sendgrid-account).

### Create a managed MongoDB with Atlas

1. Navigate to [MongoDB's website](https://www.mongodb.com/cloud/atlas), sign up for a free account, and then log in.
2. After creating the account, enter the organization name, project name, and select your preferred language (JavaScript).
3. Select the **Shared Cluster** to get a free version with up to 512 MB storage which is great for development purposes.
4. On the "Create a Starter Cluster" page you can select cloud provider, region, region, cluster tier, and
   MongoDB settings, like version and backup frequency (Note: there is no option to create backups in the free tier).
5. If you already know to which cloud provider and region you want to deploy later, you should select the same here for best performance. Otherwise select a region close to the location where you plan to deploy the application later.
6. Select **M0 Sandbox** as the Cluster Tier, give your cluster a name, and then click the "Create Cluster" button.
7. It will now take a couple of minutes to create the cluster and you will be redirected to the MongoDB Atlas Admin interface.
8. Now you must configure access and security before you can use the database.
9. To whitelist an IP address, go to the **Network Access** section and click the "Add IP Address" button. For local development you can select your current IP address.
10. Create a user by selecting the **Add New Database User** in Database Access, adding a username and password (Password Authentication method) and give him read and write access to any database within the cluster.
    A user account is required to connect to the database, so remember these values because you will need them as part of your connection string.
11. Within the Clusters section, click the **Connect** button in your cluster to connect to the database.
12. You could now connect to the cluster using [MongoDB Compass](https://www.mongodb.com/products/compass), which is a graphical interface (GUI) to interact with the database.
13. But we need to select **Connect your application** to get the connection string, it should look like this: `mongodb+srv://<username>:<password>@your-cluster.12abc.mongodb.net/your-database?retryWrites=true&w=majority`
    and replace `<username>` and `<password>` with the credentials you just created.
    Back in your project, open your `.env` file and update `MONGODB_URI` with your new connection string. > NOTE! - If you don't have an `.env` file yet, rename `.env.example` to `.env` and follow the comments to update the values in that file.
14. **Success!**
    You can test that it works locally by updating `MONGODB_URI_LOCAL` to the same connection string you just updated in `MONGO_URI`.
    After rebuilding/serving, the app should work, but users that were previously created in local testing will not exist in the new database!
    Don't forget to return the `MONGO_URI_LOCAL` to your local test database (if you so desire).

You can find **more information** about how to get started with Atlas [here](https://docs.atlas.mongodb.com/getting-started/).

### SendGrid Account

1. Navigate to [SendGrid's Website](https://sendgrid.com/), sign up for a free account, and complete the verification process.
2. Open your `.env` file and update `SENDGRID_USERNAME` and `SENDGRID_PASSWORD` with your SendGrid username and password respectively.

### Build the app

Building the app locally is required to generate a zip to deploy because the App Service won't execute build tasks.
Build the app however you normally would:

- `ctrl + shift + b` - kicks off default build in VS Code
- execute `npm run build` from a terminal window

### Troubleshooting failed deployments

Deployment can fail for various reasons, if you get stuck with a page that says _Service Unavailable_ or some other error, [open an issue](https://github.com/Microsoft/TypeScript-Node-Starter/issues/new) and I'll try to help you resolve the problems.

# TypeScript + Node

In the next few sections I will call out everything that changes when adding TypeScript to an Express project.
Note that all of this has already been set up for this project, but feel free to use this as a reference for converting other Node.js projects to TypeScript.

## Getting TypeScript

TypeScript itself is simple to add to any project with `npm`.

```
npm install -D typescript
```

If you're using VS Code then you're good to go!
VS Code will detect and use the TypeScript version you have installed in your `node_modules` folder.
For other editors, make sure you have the corresponding [TypeScript plugin](http://www.typescriptlang.org/index.html#download-links).

## Project Structure

The most obvious difference in a TypeScript + Node project is the folder structure.
In a TypeScript project, it's best to have separate _source_ and _distributable_ files.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.
The `test` and `views` folders remain top level as expected.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name                 | Description                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **.vscode**          | Contains VS Code specific settings                                                                                                      |
| **.github**          | Contains GitHub settings and configurations, including the GitHub Actions workflows                                                     |
| **dist**             | Contains the distributable (or output) from your TypeScript build. This is the code you ship                                            |
| **node_modules**     | Contains all your npm dependencies                                                                                                      |
| **src**              | Contains your source code that will be compiled to the dist dir                                                                         |
| **src/config**       | Passport authentication strategies and login middleware. Add other complex config code here                                             |
| **src/constants**    | All constants used in API system should be declared here                                                                                |
| **src/controllers**  | Controllers define functions that respond to various http requests, can have v1, v2 APIs                                                |
| **src/dto**          | Contains Data Transfer Object templates, like Response template                                                                         |
| **src/graphql**      | Contains GraphQL resolvers and schema                                                                                                   |
| **src/lib**          | Contains utilities, helpers that help to integrate 3rd party solution to the code base                                                  |
| **src/middleware**   | Middleware that used by Express server                                                                                                  |
| **src/models**       | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB                                            |
| **src/public**       | Static assets that will be used client side                                                                                             |
| **src/repositories** | Business logic of each model entity defined here, the service will retrieve data via the repository                                     |
| **src/routes**       | Define API endpoints                                                                                                                    |
| **src/services**     | Contains the business logic that used by Controller, Service can have one or many repositories to proceed and return the necessary data |
| **src/swagger**      | Contains json file that used to render swagger page                                                                                     |
| **src/types**        | Holds .d.ts files not found on DefinitelyTyped. Covered more in this [section](#type-definition-dts-files)                              |
| **src/util**         | Contains common function, helpers that can be used across the project                                                                   |
| **src**/server.ts    | Entry point to your express app                                                                                                         |
| **test**             | Contains your tests. Separate from source because there is a different build process.                                                   |
| .env.example         | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos.                                           |
| .travis.yml          | Used to configure Travis CI build                                                                                                       |
| .copyStaticAssets.ts | Build script that copies images, fonts, and JS libs to the dist folder                                                                  |
| jest.config.js       | Used to configure Jest running tests written in TypeScript                                                                              |
| package.json         | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                              |
| tsconfig.json        | Config settings for compiling server code written in TypeScript                                                                         |
| tsconfig.tests.json  | Config settings for compiling tests written in TypeScript                                                                               |
| .eslintrc            | Config settings for ESLint code style checking                                                                                          |
| .eslintignore        | Config settings for paths to exclude from linting                                                                                       |

## Building the project

It is rare for JavaScript projects not to have some kind of build pipeline these days, however Node projects typically have the least amount of build configuration.
Because of this I've tried to keep the build as simple as possible.
If you're concerned about compile time, the main watch task takes ~2s to refresh.

### Configuring TypeScript compilation

TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled.

```json
"compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
        "*": [
            "node_modules/*",
            "src/types/*"
        ]
    }
},
```

| `compilerOptions`            | Description                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"module": "commonjs"`       | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use                                                               |
| `"esModuleInterop": true,`   | Allows usage of an alternate module import syntax: `import foo from 'foo';`                                                                                |
| `"target": "es6"`            | The output language level. Node supports ES6, so we can target that here                                                                                   |
| `"noImplicitAny": true`      | Enables a stricter setting which throws errors when something has a default `any` value                                                                    |
| `"moduleResolution": "node"` | TypeScript attempts to mimic Node's module resolution strategy. Read more [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node) |
| `"sourceMap": true`          | We want source maps to be output along side our JavaScript. See the [debugging](#debugging) section                                                        |
| `"outDir": "dist"`           | Location to output `.js` files after compilation                                                                                                           |
| `"baseUrl": "."`             | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped)                                              |
| `paths: {...}`               | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped)                                              |

The rest of the file define the TypeScript project context.
The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context:

```json
"include": [
    "src/**/*"
]
```

`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:

| Npm Script           | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `build-sass`         | Compiles all `.scss` files to `.css` files                                                    |
| `build-ts`           | Compiles all source `.ts` files to `.js` files in the `dist` folder                           |
| `build`              | Full build. Runs ALL build tasks (`build-sass`, `build-ts`, `lint`, `copy-static-assets`)     |
| `copy-static-assets` | Calls script that copies JS libs, fonts, and images to dist directory                         |
| `debug`              | Performs a full build and then serves the app in watch mode                                   |
| `lint`               | Runs ESLint on project files                                                                  |
| `serve-debug`        | Runs the app with the --inspect flag                                                          |
| `serve`              | Runs node on `dist/server.js` which is the apps entry point                                   |
| `start`              | Does the same as 'npm run serve'. Can be invoked with `npm start`                             |
| `test`               | Runs tests using Jest test runner                                                             |
| `watch-debug`        | The same as `watch` but includes the --inspect flag so you can attach a debugger              |
| `watch-node`         | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task     |
| `watch-sass`         | Same as `build-sass` but continuously watches `.scss` files and re-compiles when needed       |
| `watch-test`         | Runs tests in watch mode                                                                      |
| `watch-ts`           | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed           |
| `watch`              | Runs all watch tasks (TypeScript, Sass, Node). Use this if you're not touching static assets. |

## Type Definition (`.d.ts`) Files

TypeScript uses `.d.ts` files to provide types for JavaScript libraries that were not written in TypeScript.
This is great because once you have a `.d.ts` file, TypeScript can type check that library and provide you better help in your editor.
The TypeScript community actively shares all the most up-to-date `.d.ts` files for popular libraries on a GitHub repository called [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types).
Making sure that your `.d.ts` files are setup correctly is super important because once they're in place, you get an incredible amount of high quality type checking (and thus bug catching, IntelliSense, and other editor tools) for free.

> **Note!** Because we're using `"noImplicitAny": true`, we are required to have a `.d.ts` file for **every** library we use. While you could set `noImplicitAny` to `false` to silence errors about missing `.d.ts` files, it is a best practice to have a `.d.ts` file for every library. (Even if the `.d.ts` file is [basically empty!](#writing-a-dts-file))

### Installing `.d.ts` files from DefinitelyTyped

For the most part, you'll find `.d.ts` files for the libraries you are using on DefinitelyTyped.
These `.d.ts` files can be easily installed into your project by using the npm scope `@types`.
For example, if we want the `.d.ts` file for jQuery, we can do so with `npm install --save-dev @types/jquery`.

> **Note!** Be sure to add `--save-dev` (or `-D`) to your `npm install`. `.d.ts` files are project dependencies, but only used at compile time and thus should be dev dependencies.

In this template, all the `.d.ts` files have already been added to `devDependencies` in `package.json`, so you will get everything you need after running your first `npm install`.
Once `.d.ts` files have been installed using npm, you should see them in your `node_modules/@types` folder.
The compiler will always look in this folder for `.d.ts` files when resolving JavaScript libraries.

### What if a library isn't on DefinitelyTyped?

If you try to install a `.d.ts` file from `@types` and it isn't found, or you check DefinitelyTyped and cannot find a specific library, you will want to create your own `.d.ts file`.
In the `src` folder of this project, you'll find the `types` folder which holds the `.d.ts` files that aren't on DefinitelyTyped (or weren't as of the time of this writing).

#### Setting up TypeScript to look for `.d.ts` files in another folder

The compiler knows to look in `node_modules/@types` by default, but to help the compiler find our own `.d.ts` files we have to configure path mapping in our `tsconfig.json`.
Path mapping can get pretty confusing, but the basic idea is that the TypeScript compiler will look in specific places, in a specific order when resolving modules, and we have the ability to tell the compiler exactly how to do it.
In the `tsconfig.json` for this project you'll see the following:

```json
"baseUrl": ".",
"paths": {
    "*": [
        "node_modules/*",
        "src/types/*"
    ]
}
```

This tells the TypeScript compiler that in addition to looking in `node_modules/@types` for every import (`*`) also look in our own `.d.ts` file location `<baseUrl>` + `src/types/*`.
So when we write something like:

```ts
import * as flash from 'express-flash';
```

First the compiler will look for a `d.ts` file in `node_modules/@types` and then when it doesn't find one look in `src/types` and find our file `express-flash.d.ts`.

#### Using `dts-gen`

Unless you are familiar with `.d.ts` files, I strongly recommend trying to use the tool [dts-gen](https://github.com/Microsoft/dts-gen) first.
The [README](https://github.com/Microsoft/dts-gen#dts-gen-a-typescript-definition-file-generator) does a great job explaining how to use the tool, and for most cases, you'll get an excellent scaffold of a `.d.ts` file to start with.
In this project, `bcrypt-nodejs.d.ts`, `fbgraph.d.ts`, and `lusca.d.ts` were all generated using `dts-gen`.

#### Writing a `.d.ts` file

If generating a `.d.ts` using `dts-gen` isn't working, [you should tell me about it first](https://www.surveymonkey.com/r/LN2CV82), but then you can create your own `.d.ts` file.

If you just want to silence the compiler for the time being, create a file called `<some-library>.d.ts` in your `types` folder and then add this line of code:

```ts
declare module '<some-library>';
```

If you want to invest some time into making a great `.d.ts` file that will give you great type checking and IntelliSense, the TypeScript website has great [docs on authoring `.d.ts` files](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

#### Contributing to DefinitelyTyped

The reason it's so easy to get great `.d.ts` files for most libraries is that developers like you contribute their work back to DefinitelyTyped.
Contributing `.d.ts` files is a great way to get into the open source community if it's something you've never tried before, and as soon as your changes are accepted, every other developer in the world has access to your work.

If you're interested in giving it a shot, check out the [guidance on DefinitelyTyped](https://github.com/definitelyTyped/DefinitelyTyped/#how-can-i-contribute).
If you're not interested, [you should tell me why](https://www.surveymonkey.com/r/LN2CV82) so we can help make it easier in the future!

### Summary of `.d.ts` management

In general if you stick to the following steps you should have minimal `.d.ts` issues;

1. After installing any npm package as a dependency or dev dependency, immediately try to install the `.d.ts` file via `@types`.
2. If the library has a `.d.ts` file on DefinitelyTyped, the installation will succeed, and you are done.
   If the install fails because the package doesn't exist, continue to step 3.
3. Make sure you project is [configured for supplying your own `d.ts` files](#setting-up-typescript-to-look-for-dts-files-in-another-folder)
4. Try to [generate a `.d.ts` file with dts-gen](#using-dts-gen).
   If it succeeds, you are done.
   If not, continue to step 5.
5. Create a file called `<some-library>.d.ts` in your `types` folder.
6. Add the following code:

```ts
declare module '<some-library>';
```

7. At this point everything should compile with no errors, and you can either improve the types in the `.d.ts` file by following this [guide on authoring `.d.ts` files](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) or continue with no types.
8. If you are still having issues, let me know by emailing me or pinging me on twitter, I will help you.

## Debugging

Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps

Source maps allow you to drop break points in your TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime.

> **Note!** - Source maps aren't specific to TypeScript.
> Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps

First you need to make sure your `tsconfig.json` has source map generation enabled:

```json
"compilerOptions" {
    "sourceMap": true
}
```

With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
> This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
> Because we are writing Node.js code, we don't have to worry about this.

### Using the debugger in VS Code

Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to set up and even easier to use.
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

You can debug in the following ways:

- **Launch Program** - transpile typescript to javascript via npm build, then launch the app with the debugger attached on startup
- **Attach by Process ID** - run the project in debug mode. This is mostly identical to the "Node.js: Attach by Process ID" template with one minor change.
  We added `"protocol": "inspector"` which tells VS Code that we're using the latest version of Node which uses a new debug protocol.
- **Jest Current File** - have a Jest test file open and active in VSCode, then debug this specific file by setting break point. All tests are not run.
- **Jest all** - run all tests, set a break point.

In this file, you can tell VS Code exactly what you want to do:

```json
[
  {
    "name": "Launch Program",
    "type": "node",
    "program": "${workspaceFolder}/dist/server.js",
    "request": "launch",
    "preLaunchTask": "npm: build"
  },
  {
    "type": "node",
    "request": "attach",
    "name": "Attach by Process ID",
    "processId": "${command:PickProcess}",
    "protocol": "inspector"
  },
  {
    "type": "node",
    "request": "launch",
    "name": "Jest Current File",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["${fileBasenameNoExtension}", "--detectOpenHandles"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "disableOptimisticBPs": true,
    "windows": {
      "program": "${workspaceFolder}/node_modules/jest/bin/jest"
    }
  },
  {
    "type": "node",
    "request": "launch",
    "name": "Jest all",
    "runtimeExecutable": "npm",
    "runtimeArgs": ["run-script", "test"],
    "port": 9229,
    "skipFiles": ["<node_internals>/**"]
  }
]
```

With this file in place, you can hit `F5` to attach a debugger.
You will probably have multiple node processes running, so you need to find the one that shows `node dist/server.js`.
Now just set your breakpoints and go!

## Testing

For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.
While Mocha is probably more common, Mocha seems to be looking for a new maintainer and setting up TypeScript testing in Jest is wicked simple.

### Install the components

To add TypeScript + Jest support, first install a few npm packages:

```
npm install -D jest ts-jest
```

`jest` is the testing framework itself, and `ts-jest` is just a simple function to make running TypeScript tests a little easier.

### Configure Jest

Jest's configuration lives in `jest.config.js`, so let's open it up and add the following code:

```js
module.exports = {
  globals: {
    'ts-jest': {
      tsconfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js',
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  testEnvironment: 'node',
};
```

Basically we are telling Jest that we want it to consume all files that match the pattern `"**/test/**/*.test.(ts|js)"` (all `.test.ts`/`.test.js` files in the `test` folder), but we want to preprocess the `.ts` files first.
This preprocess step is very flexible, but in our case, we just want to compile our TypeScript to JavaScript using our `tsconfig.json`.
This all happens in memory when you run the tests, so there are no output `.js` test files for you to manage.

### Running tests

Simply run `npm run test`.
Note this will also generate a coverage report.

### Writing tests

Writing tests for web apps has entire books dedicated to it and best practices are strongly influenced by personal style, so I'm deliberately avoiding discussing how or when to write tests in this guide.
However, if prescriptive guidance on testing is something that you're interested in, [let me know](https://www.surveymonkey.com/r/LN2CV82), I'll do some homework and get back to you.

## ESLint

ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

### ESLint rules

Like most linters, ESLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `.eslintrc` configuration file.
In this project, we are using a fairly basic set of rules with no additional custom rules.

### Running ESLint

Like the rest of our build steps, we use npm scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.

```
npm run build   // runs full build including ESLint
npm run lint    // runs only ESLint
```

Notice that ESLint is not a part of the main watch task.

If you are interested in seeing ESLint feedback as soon as possible, I strongly recommend the [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

### VSCode Extensions

To enhance your development experience while working in VSCode we also provide you a list of the suggested extensions for working with this project:

![Suggested Extensions In VSCode](https://user-images.githubusercontent.com/14539/34583539-6f290a30-f198-11e7-8804-30f40d418e20.png)

- [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)

# Dependencies

Dependencies are managed through `package.json`.
In that file you'll find two sections:

## `dependencies`

| Package            | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| async              | Utility library that provides asynchronous control flow.      |
| bcrypt-nodejs      | Library for hashing and salting user passwords.               |
| bluebird           | Promise library                                               |
| body-parser        | Express 4 middleware.                                         |
| compression        | Express 4 middleware.                                         |
| connect-mongo      | MongoDB session store for Express.                            |
| dotenv             | Loads environment variables from .env file.                   |
| errorhandler       | Express 4 middleware.                                         |
| express            | Node.js web framework.                                        |
| express-flash      | Provides flash messages for Express.                          |
| express-session    | Express 4 middleware.                                         |
| express-validator  | Easy form validation for Express.                             |
| fbgraph            | Facebook Graph API library.                                   |
| lodash             | General utility library.                                      |
| lusca              | CSRF middleware.                                              |
| mongoose           | MongoDB ODM.                                                  |
| nodemailer         | Node.js library for sending emails.                           |
| passport           | Simple and elegant authentication library for node.js         |
| passport-facebook  | Sign-in with Facebook plugin.                                 |
| passport-local     | Sign-in with Username and Password plugin.                    |
| request            | Simplified HTTP request library.                              |
| request-promise    | Promisified HTTP request library. Let's us use async/await    |
| winston            | Logging library                                               |
| twilio             | SMS message                                                   |
| swagger-ui-express | Generated API docs from express, based on a swagger.json file |

## `devDependencies`

| Package      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| @types       | Dependencies in this folder are `.d.ts` files used to provide types     |
| chai         | Testing utility library that makes it easier to write tests             |
| concurrently | Utility that manages multiple concurrent tasks. Used with npm scripts   |
| jest         | Testing library for JavaScript.                                         |
| sass         | Allows to compile .scss files to .css                                   |
| nodemon      | Utility that automatically restarts node process when it crashes        |
| supertest    | HTTP assertion library.                                                 |
| ts-jest      | A preprocessor with sourcemap support to help use TypeScript with Jest. |
| ts-node      | Enables directly running TS files. Used to run `copy-static-assets.ts`  |
| eslint       | Linter for JavaScript and TypeScript files                              |
| typescript   | JavaScript compiler/type checker that boosts JavaScript productivity    |

To install or update these dependencies you can use `npm install` or `npm update`.

## License

Copyright (c) SOUM. All rights reserved.
Licensed under the [MIT](LICENSE) License.
