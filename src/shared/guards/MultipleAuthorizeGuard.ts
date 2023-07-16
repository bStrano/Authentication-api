import {CanActivate, ExecutionContext, Injectable, SetMetadata, Type, UnauthorizedException} from "@nestjs/common";
import {ModuleRef, Reflector} from "@nestjs/core";

// REFERENCE: https://stackoverflow.com/questions/63896604/nestjs-combine-multiple-guards-and-activate-if-one-returns-true/69966319#69966319

@Injectable()
export class MultipleAuthorizeGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const allowedGuards =
            this.reflector.get<Type<CanActivate>[]>(
                'multipleGuardsReferences',
                context.getHandler(),
            ) || [];

        const guards = allowedGuards.map((guardReference) =>
            this.moduleRef.get<CanActivate>(guardReference),
        );

        if (guards.length === 0) {
            return Promise.resolve(true);
        }

        if (guards.length === 1) {
            return guards[0].canActivate(context) as Promise<boolean>;
        }

        return Promise.any(
            guards.map((guard) => {
                return guard.canActivate(context) as Promise<boolean>;
            }),
        ).catch(e => {
            throw new UnauthorizedException()
        });
    }
}


export const MultipleGuardsReferences = (...guards: Type<CanActivate>[]) =>
    SetMetadata('multipleGuardsReferences', guards);
