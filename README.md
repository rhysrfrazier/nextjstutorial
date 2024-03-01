# NextJS Tutorial

This repo is a place to store notes about starting a new NextJS project, as well as the code as it progresses. I'll basically be re-creating the first two sections of the  NextJS tutorial (which is perfectly fine, but I figured I'd take some more markdown doc practice too while I'm doing this). For the full tutorial this repo was pulled from, please look [here](https://nextjs.org/learn?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=home).

## Motivation

I wanted to explore the options beyond React and see what other frameworks have to offer! I'd heard that Next.js had some features that made it a better choice for SEO optimization, so was particularly interested in that to start with - and there are a lot of options for configuring metadata that I've only scratched the surface of.

## Evaluation
Thinks I like about Next.js:
* Combination of server and client side rendering, which allows for a more app-like user experience (no full page refreshes every time you go to a different part of the site!)
* File-system routing with nested routes. This just jives really well with my brain and I like seeing the structure of my site very clearly through the file structure
* Ease of configuring metadata for SEO
* Ease of implementing streaming using loading files and Suspense
* NextAuth library, which made my first foray into authentication much simpler than I expected it to be and supports either credentials or alternative authentication providers like OAuth and email authentication.

### New Technologies used:
* Next.js (obviously)
* Zod
* NextAuth
* Tailwind CSS (Love this! All the flexibility of vanilla css, all the ease of a framework, and easy to style as you go. Definitely want to use more of this)
* TypeScript (This makes catching errors and debugging so much easier than JS and I can't wait to use more of it)
* Vercel deployment
* ESLint accessibility plugin

## Project Demo:
Feel free to take a look through the code - It's got some notes from the folks at Next.js, as well as my own notes when I encountered something new and wanted to annotate.

If you want to see the demo in action, check out https://nextjs-demo-delta-roan.vercel.app/ with the following login credentials:

user@nextmail.com
123456

Finally, feel free to send me a message if you have any questions or notice any issues!

## Tutorial Beginning:

### Creating a New Project

The tutorial we're using here doesn't have you make an entire project from scratch, but does provide an example project to jump into and start exploring features of NextJS. This helps emulate hopping into a new project in a production environment, and saves some time with the basics that we already know from React.
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

Now, after you save, you'll see that some styling has been added to your home page, even though you didn't add any CSS rules. That's because in ```global.css```, there are some ```@tailwind``` directives:

``` ts
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Tailwind

[Tailwind](https://tailwindcss.com/) is a CSS framework that allows you to quickly write [utility classes](https://tailwindcss.com/docs/utility-first) directly into TSX markup.

You style elements with Tailwind by adding class names. The following example will turn the  ```<h1>``` text blue:

``` ts
<h1 className="text-blue-500">I'm blue!</h1>
```

CSS styles are shared globally, but each class is singularly applied to each element. That means that whenever you add or delete elements, you don't have to clean up any other stylesheets, and you don't have to worry about the size of the CSS bundle growing as you need to style more components. (Complete aside: I'll probably use Tailwind or something similar for the Frazier Knives website).

In the ```/app/page.tsx``` file, you'll see that Tailwind classes are used in our example code.

Let's play with Tailwind a little here. Copy and paste the following code above the ```<p>``` element in ```/app/page.tsx```:

``` ts
<div
  className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent"
/>
```

This code just creates a black triangle.

If you'd rather like traditional CSS rules or like keeping the styles separate from JSX, CSS Modules are a great alternative.

#### CSS Modules

CSS Modules let you scope CSS to a component by automatically creating unique class names, so you don't have to worry about style collision (assuming you keep track of everything well enough).

If you were to use CSS instead of Tailwind, you would go into the ```/app/ui``` folder, create a file called ```home/module.css```, and add the following CSS rules:

``` css
.shape {
  height: 0;
  width: 0;
  border-bottom: 30px solid black;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```

Then, inside ```/app/page.tsx``` import the styles and replace the Tailwind class names from the ```<div>``` you've added with ```styles.shape```:

``` tsx
import styles from '@/app/ui/home.module.css';
<div className={styles.shape} />;
```

If you do this and save the changes, you should see the same shape as before.

Tailwind and CSS modules are the two most common ways of styling Next.js applications.

#### Using the ```clsx``` library to toggle class names

[```clsx```](https://www.npmjs.com/package/clsx) is a library that lets you toggle class names easily, for when you need to conditionally style an element based on state or other conditions.

Here are some examples of when we can use it in this demo:

- If you want to create an ```InvoiceStatus``` component, which accepts a ```status``` or either ```paid``` or ```pending```
- If you want the color to be green if it's ```paid``` and grey if it's ```pending```

You can use ```clsx``` to conditionally apply classes, like so:

``` tsx
import clsx from 'clsx';
 
export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

#### Other Styling Solutions

There are, of course, other ways you can style your NextJS application:

- Sass allows you to import ```.css``` and ```.scss``` files
- CSS-in-JS libraries like styled-jsx, styled-components, and emotion are also options

***

__To keep following along, go to the [Next.js tutorial](https://nextjs.org/learn/dashboard-app/optimizing-fonts-images)__