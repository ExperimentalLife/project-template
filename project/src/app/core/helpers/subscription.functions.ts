import { Subscription } from 'rxjs';

export function throttle(callback: Function, delay: number): (args: Array<any>) => void {
   let timeout = null;
   return (...args) => {
      if (!timeout) {
         timeout = setTimeout(() => {
            callback.call(this, ...args);
            timeout = null;
         }, delay);
      }
   };
}

export function removeSubscriptions(subscriptions): Array<Subscription> {
   if (subscriptions) {
      subscriptions.forEach((subscription: Subscription) => {
         subscription.unsubscribe();
      });
   }
   return [];
}

export function removeListeners(listeners): Array<Function> {
   if (listeners) {
      listeners.forEach((listener: Function) => {
         listener();
      });
   }
   return [];
}
