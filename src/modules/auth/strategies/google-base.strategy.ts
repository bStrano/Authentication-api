import { VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

export class GoogleStrategyHelper {
  static async validateGoogleUser(
    authService: AuthService,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = await authService.validateGoogleUser({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      profilePicture: photos[0].value,
      googleId: id,
    });
    done(null, user);
  }
}
