# NextJS Tutorial
This repo is a place to store notes about starting a new NextJS project, as well as the code as it progresses.
I'd like to explore the options beyond React and see what other frameworks have to offer.
## Getting started
### Creating a New Project
The [tutorial](https://nextjs.org/learn?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=home) we're using here doesn't have you make an entire project from scratch, but does provide an example project to jump into and start exploring features of NextJS. This helps emulate hopping into a new project in a production environment, and saves some time with the basics that we already know from React.
- cd into the folder you want the project to live in and run the following:
    ```
    npx create-next-app@latest nextjs-dashboard --use-npm --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example"
    ```
    - The ```create-next-app``` command is a CLI tool that sets up a NextJS application for you. In this tutorial's example, we're also using a [starter example](https://github.com/vercel/next-learn/tree/main/dashboard/starter-example), which we access using the ```--example``` component of the command.
### Exploring the Project
As mentioned above, this project already has some code in it! The NextJS app that we created with the CLI command is in a folder called ```nextjs-dashboard```. navigate into the ```nextjs-dashboard``` and take a look at the file structure:
