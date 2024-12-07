# CSC 307 To Do List Project – Chain Reaction

## Description

This project was created with the intention of helping students and teachers track tasks in a more effective and intuitive way than simply using a paper checklist or other to-do list app. This app's differentiating feature will be the ability to 'chain' together tasks (hence the name), such that once one is complete, the next one in the chain will drop populate your inbox. This is still a work in progress, and the form is taking shape. This app supports multiple task areas, with each one able to have as many subareas as the heart desires. Each area has tasks that you can group and order into chains, and each task can have lists of minor requirements that form your task. Our group has worked hard to form this idea and put it together, and we look forwards to receiving feedback and hearing back from testing.

## Members:

Corbyn Rasque\
Elijah Villanueva\
Khushkaranpreet Singh Grewal

## Contributing:
**Style Guide Choice:** [AirBnB](https://airbnb.io/javascript/react/)

**IDE Setup Requirements:**

- Node Package Manager
- Prettier
- ESLint

## Development Environment Setup

Node Version >= 20.x Required

Besides using `npm install` in both the root directory & `./packages/express-backend`, you will need several environment variables set up.

In `express-backend`, variables for `TOKEN_SECRET` and `SUPABASE_URI` will be necessary for bcrypt & jsonwebtoken.

In `react-frontend`, the variable `VITE_API_URL` will need to be placed in both `.env` and `.env.production`, pointing to the `localhost:8000` and the live website, respectively.

## UML Class Diagram & UI Protype
These can be found in the Wiki pages. Link: https://github.com/Corbyn-Rasque/Chain-Reaction/wiki
