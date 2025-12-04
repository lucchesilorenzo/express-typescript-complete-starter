# Step-by-Step Guide to Setting Up Express with TypeScript (Complete Version)

## Getting Started

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

### Installation

1. **Clone repository:**

```bash
git clone https://github.com/lucchesilorenzo/express-typescript-complete-starter.git
cd express-typescript-complete-starter
code .
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run migrations:**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Run seeders:**

```bash
npx prisma db seed
```

5. **Run the following command to run your application:**

```bash
npm run dev
```

Server will be running on `http://localhost:3000`.
