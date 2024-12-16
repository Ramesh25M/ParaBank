# ParaBank

ParaBank is a web application repository designed to demonstrate and test various features related to online banking, including account management, transactions.

---

## Table of Contents

- [Project Structure](#project-structure)

- [Prerequisites](#prerequisites)

- [Installation](#installation)

- [Testing](#testing)

---


## Project Structure

The repository is organized as follows:

```

ParaBank/

├── .github/

│   └── workflows/           # GitHub Actions workflows for CI/CD

├── .idea/                   # Project configuration files for IDE

├── data/                    # Test data files

├── pages/                   # Page Object Models (POM) for different web pages

├── selectors/               # Selectors used in tests

├── tests/                   # Test scripts

├── .gitignore               # Git ignore file

├── Jenkinsfile              # Jenkins pipeline configuration

├── README.md                # Project documentation

├── package-lock.json        # npm lock file

├── package.json             # npm package configuration

├── playwright.config.ts     # Playwright configuration

└── tsconfig.json            # TypeScript configuration

```

---

## Prerequisites

To work with the ParaBank repository, ensure the following software is installed on your machine:

- **Git**: For cloning the repository

- **Node.js & npm**: For managing dependencies and running the application

---

## Installation

### Clone the Repository

```bash

git clone https://github.com/Ramesh25M/ParaBank.git

cd ParaBank

```

### Install Dependencies

Use npm to install the required dependencies:

```bash

npm install

```

---

## Testing

### Run Tests

For Playwright tests, you may need to specify the browser:

```bash

npx playwright test --project='chrome'

```

---

