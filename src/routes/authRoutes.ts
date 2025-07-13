import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { AuthValidator } from '@/validators/AuthValidator';
import { ValidationMiddleware } from '@/middleware/ValidationMiddleware';
import { AuthMiddleware } from '@/middleware/AuthMiddleware';

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /api/auth/register
    this.router.post(
      '/register',
      ValidationMiddleware.validate(AuthValidator.validateRegister),
      this.authController.register.bind(this.authController)
    );

    // POST /api/auth/login
    this.router.post(
      '/login',
      ValidationMiddleware.validate(AuthValidator.validateLogin),
      this.authController.login.bind(this.authController)
    );

    // GET /api/auth/profile
    this.router.get(
      '/profile',
      AuthMiddleware.authenticate,
      this.authController.getProfile.bind(this.authController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}