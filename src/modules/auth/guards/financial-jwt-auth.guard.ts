import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {lookupPlatformName, PlatformEnum} from "../../../shared/constants/PlatformEnum";

@Injectable()
export class FinancialJwtAuthGuard extends AuthGuard(lookupPlatformName(PlatformEnum.FINANCIAL)) {}
