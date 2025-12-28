import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleFinancialAuthGuard extends AuthGuard('google-financial') {}
