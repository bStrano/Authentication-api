import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleKeychainAuthGuard extends AuthGuard('google-keychain') {}
