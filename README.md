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

As mentioned above, this project already has some code in it! The NextJS app that we created with the CLI command is in a folder called ```nextjs-dashboard```. navigate into the ```nextjs-dashboard``` and take a look at the file structure.

#### Structure

- ```/app``` contains all the routes, components, and logic for the application. You'll mostly be working from here
    - ```/app/lib``` contains the functions used in the application, such as reusable utility functions and data fetching functions
    -  ```/app/ui``` contains all the UI components for the application, like cards, tables, and forms. In the example we've imported, these have been pre-styled
 -  ```/public``` contains all of the static assets for the application, like images
 -  ```/scripts```: contains a seeding script that you'll use to populate the database in a later section of this tutorial
 -  **Config Files**: There are also config files in the root of the application (like ```next.config.js```). Most of these are created and pre-configured when you start a new project using ```create-next-app```. We're not going to modify them for the purposes of this tutorial.

#### Placeholder Data

For the purposes of this tutorial, we've got a file of placeholder data at ```app/lib/placeholder-data.js```. We'll use this to seed the database with some mock data.

#### TypeScript

This tutorial project is written in TypeScript, so has .tx or .tsx files. Exciting!

TypeScript helps us ensure we don't accidentally pass the wrong data format to the components or database, like accidentally passing a string instead of a number to the invoice amount.

Check out how the invoice type is manually defined in ```/app/lib/definitions.ts```:

``` ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
```

### Running the development Server

- Run ```npm i``` to install the project's packages
- Then run ```npm run dev``` to start the development server
- The NextJS development server will run on PORT 3000, so you should be able to open http://localhost:3000 to get into the demo project.

## CSS Styling

The front page doesn't have any style yet, so this section will fix that

### Global Styles

In the ```/app/ui``` folder, there's a file called ```global.css```. You can use this file to add CSS rules to all of the routes in the application, such as CSS reset rules, site-wide styles for HTML elements like links, etc.

You can import ```global.css``` in any component of the application, but it's usually good practice to add it to the top-level component. In NextJS, this is called the root layer (and we'll learn more about it later)

- Add global styles to the application by going into ```/app/layout.tsx``` and importing the ```global.css``` file, like so:

``` ts
import '@/app/ui/global.css';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```