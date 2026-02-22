# Flowable Nuxt 4 Modern UI

A production-ready, high-performance Web-UI for **Flowable BPM (6.8+ / 7.x)** built with **Nuxt 4**, **Vue 3**, and **Tailwind CSS**.

![Flowable Nuxt UI](https://img.shields.io/badge/Nuxt-4.x-green)
![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)
![Flowable](https://img.shields.io/badge/Flowable-6.8%2B%20%2F%207.x-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

-   **Dashboard**: Real-time KPI cards and summary of pending tasks.
-   **Task Inbox**: Advanced filtering, sorting, and pagination for current user tasks.
-   **Dynamic Form Renderer**: Renders Flowable Form JSON into modern `@nuxt/ui` components dynamically.
-   **Process Management**: Browse definitions, start instances, and monitor active processes.
-   **History**: Search and view finalized process instances and completed tasks.
-   **Admin Panel**: Built-in Identity Management (IDM) for Users and Groups.
-   **i18n**: Full German (**DE**) and English (**EN**) support.
-   **Dark Mode**: Native dark mode support via `@nuxt/ui`.
-   **Global Auth Middleware**: Secure route protection with Pinia persistence.

## 🛠 Tech Stack

-   **Framework**: [Nuxt 4 (App Router)](https://nuxt.com)
-   **UI Library**: [@nuxt/ui v3](https://ui3.nuxt.com) (Radix Vue + Tailwind CSS)
-   **State Management**: [Pinia](https://pinia.vuejs.org) + [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
-   **Languages**: TypeScript (Strict Mode)
-   **HTTP Client**: $fetch (Nuxt native) with Nitro Server Proxy
-   **Validation**: [Zod](https://zod.dev)
-   **Icons**: [Lucide Vue Next](https://lucide.dev)

## 📦 Setup

### Prerequisites

-   Node.js 22.x
-   A running Flowable BPM instance (REST API enabled)

### Local Installation

1.  **Clone and install**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.example` to `.env` and adjust the variables:
    ```bash
    FLOWABLE_REST_URL=http://your-flowable-host:8080/flowable-rest/service
    FLOWABLE_AUTH_BASIC_USER=admin
    FLOWABLE_AUTH_BASIC_PASSWORD=test
    NUXT_AUTH_SECRET=your_32_char_secret_key
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

### Devbox Environment

Alternatively, use [Devbox](https://www.jetpack.io/devbox) for a reproducible Nix-based environment:
```bash
devbox shell
npm install
npm run dev
```

## 🏗 Architecture

### Nitro API Proxy
To avoid CORS issues and secure sensitive credentials (Basic Auth), all requests are proxied via `server/api/flowable/[...].ts`. Credentials stay on the server side.

### Flowable Form Renderer
The `FormRenderer.vue` component dynamically maps Flowable's JSON form model to Vue components, handling data binding via `useVModel`.

## 🔒 Security

This project is hardened against known vulnerabilities. We use **NPM Overrides** to ensure `minimatch` is at a safe version (`^10.2.1`) to prevent ReDoS attacks.

## 📄 License

MIT
