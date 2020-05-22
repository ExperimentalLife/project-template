import * as fromInterceptors from '@core/interceptors';
import * as fromLayout from './layout';
import { RouterService } from './router.service';
import { SessionService } from './session.service';
import { ClassService } from './class.service';
import { RoutingService } from './routing.service';
import { StyleService } from './style.service';

export const services = [
   fromInterceptors.HttpInterceptorService,
   fromInterceptors.HttpObservableService,
   fromInterceptors.RouteInterceptorService,

   fromLayout.FooterService,
   fromLayout.HeaderService,
   fromLayout.LayoutService,
   fromLayout.WrapperService,
   fromLayout.LayoutStoreService,

   RouterService,
   SessionService,
   ClassService,
   RoutingService,
   StyleService,
];

export * from '@core/interceptors';
export * from './layout';
export * from './router.service';
export * from './session.service';
export * from './class.service';
export * from './routing.service';
export * from './style.service';