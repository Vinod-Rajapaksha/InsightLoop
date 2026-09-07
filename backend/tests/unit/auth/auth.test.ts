import { authService } from '../../../src/modules/auth/auth.service';
import { Role } from '../../../src/models/User';

describe('Auth Service - Unit Tests', () => {
  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(typeof authService.register).toBe('function');
    expect(typeof authService.login).toBe('function');
  });
});
