# Salon Lluvia Web Application
This is the **ASP.NET Core Web API** backend portion for a local salon's website built to support online appointment scheduling, gallery browsing, and delivery of general business information. View the Angular frontend portion [here](https://github.com/boros41/ng-salonlluvia).

## Azure Deployment
This ASP.NET Core Web API project is deployed on **Microsoft Azure App Service** using:
-  **ASP.NET Core**
-  **EF Core**
-  **ASP.NET Identity**
-  **Azure SQL Database**
-  **Azure Blob Storage**
-  **Microsoft Entra ID**

This deployment supports a public-facing business website for a local salon's operation.

## Appointment Scheduling Integration
Integrated the [Calendly REST API](https://developer.calendly.com/getting-started) through an **ASP.NET Core Web API** backend gateway architecture to:
- Return only valid appointment dates based on the salon's availability
- Validate user input before scheduling an appointment
- Synchronize appointments with the salon's calendar
- Automate scheduling and reduce booking friction

This helps the business provide a smoother booking experience and reach more clients.

## Authentication and Authorization
Implemented **ASP.NET Identity** authentication and role-based authorization to secure administrative functionality, including:

- Restricting image uploads to administrators
- Restricting content management to administrators

This ensures sensitive site management features are protected from public access.

## Cloud Image Storage
Integrated **Azure Blob Storage** with **Microsoft Entra ID** authentication to securely store and retrieve uploaded gallery images. The images are cached via the **IMemoryCache** interface to improve performance on the gallery page when the images are requested.

This enables:
- Secure cloud-based image storage
- Scalable media delivery
- Public gallery access for site visitors
- Fast image retrieval

## API Endpoints
Endpoints are exposed to the Angular [frontend](https://github.com/boros41/ng-salonlluvia) for appointment scheduling, gallery image retrieval, authentication, and administrator-only gallery management:

Swagger UI:

![Backend API endpoints](https://i.imgur.com/es6iAH0.png)

## Project Highlights
- **ASP.NET Core Web API** application deployed to **Microsoft Azure App Service**
- Real-world API endpoints with business logic for a local salon website
-  **Calendly API** integration for appointment automation
-  **Azure Blob Storage** with **Microsoft Entra ID** for secure image management
