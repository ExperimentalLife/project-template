import * as fromInterceptors from '@core/interceptors';
import * as fromLayout from './layout';
import * as fromServer from './server';
import { RouterService } from './router.service';
import { SessionService } from './session.service';
import { ClassService } from './class.service';
import { RoutingService } from './routing.service';
import { StyleService } from './style.service';
import { ColorService } from './color.service';
import { AuthService } from './server/auth.service';
import { ObjectMapService } from './object-map.service';

export const services = [
   fromInterceptors.HttpInterceptorService,
   fromInterceptors.HttpObservableService,
   fromInterceptors.RouteInterceptorService,

   fromLayout.FooterService,
   fromLayout.HeaderService,
   fromLayout.LayoutService,
   fromLayout.WrapperService,
   fromLayout.LayoutStoreService,

   fromServer.AuthService,
   fromServer.InfectedService,

   RouterService,
   SessionService,
   ClassService,
   RoutingService,
   StyleService,
   ColorService,
   AuthService,
   ObjectMapService
];

export * from '@core/interceptors';
export * from './layout';
export * from './server';
export * from './router.service';
export * from './session.service';
export * from './class.service';
export * from './routing.service';
export * from './style.service';
export * from './color.service';
export * from './server/auth.service';
export * from './object-map.service';