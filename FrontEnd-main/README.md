## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand with persistence
- **API Integration**: Axios with interceptors for microservices communication
- **Authentication**: JWT-based authentication with refresh tokens
- **Routing**: React Router v6 with protected routes
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Reusable, accessible components
- **Error Handling**: Comprehensive error handling and toast notifications
- **AWS Deployment**: Ready for AWS S3, CloudFront, and Amplify
- **Docker Support**: Containerized deployment with Nginx
- **TypeScript**: Full type safety throughout the application


## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- AWS CLI (for deployment)
- Docker (optional, for containerized deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:staging` - Build for staging environment
- `npm run build:production` - Build for production environment
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to AWS
- `npm run deploy:staging` - Deploy to staging environment
- `npm run deploy:production` - Deploy to production environment
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container

## 🔧 Configuration

### Environment Variables

Create environment-specific files:
- `.env` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Required variables:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_AUTH_SERVICE_URL=http://localhost:8081
VITE_USER_SERVICE_URL=http://localhost:8082
VITE_AWS_REGION=us-east-1
VITE_AWS_S3_BUCKET=your-s3-bucket
VITE_AWS_CLOUDFRONT_DISTRIBUTION=your-cloudfront-id
```

### Microservices Integration

The application is designed to work with the following microservices:

- **Auth Service**: User authentication and authorization
- **User Service**: User management
- **Product Service**: Product management
- **Order Service**: Order processing
- **Notification Service**: Notifications and messaging

## 🚀 Deployment

### AWS S3 + CloudFront

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Set environment variables**
   ```bash
   export VITE_AWS_S3_BUCKET=your-bucket-name
   export VITE_AWS_CLOUDFRONT_DISTRIBUTION=your-distribution-id
   ```

3. **Deploy**
   ```bash
   npm run deploy:production
   ```

### AWS Amplify

1. **Deploy using Amplify CLI**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Or use the amplify.yml file** for CI/CD pipeline

### Docker Deployment

1. **Build Docker image**
   ```bash
   npm run docker:build
   ```

2. **Run container**
   ```bash
   npm run docker:run
   ```


## 🧪 Testing

Currently configured for testing setup. Add your preferred testing framework:

```bash
# Example with Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```
## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS utility classes
- Responsive breakpoints
- Touch-friendly interface

## 🎨 UI Components

Reusable components built with:
- Tailwind CSS for styling
- Accessibility in mind
- TypeScript interfaces
- Consistent design system

## 🌐 API Integration

- Axios HTTP client
- Request/response interceptors
- Error handling
- Token refresh logic
- Loading states
- TypeScript types for API responses


## 📊 Performance

- Code splitting
- Lazy loading
- Bundle optimization
- Tree shaking
- Image optimization
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
