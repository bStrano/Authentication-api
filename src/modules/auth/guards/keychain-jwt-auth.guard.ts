import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {lookupPlatformName, PlatformEnum} from "../../../shared/constants/PlatformEnum";

@Injectable()
export class KeychainJwtAuthGuard extends AuthGuard(lookupPlatformName(PlatformEnum.KEYCHAIN)) {}
