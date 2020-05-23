import { Observable, BehaviorSubject } from 'rxjs';
import { pluck, distinctUntilChanged } from 'rxjs/operators';
import { LayoutState } from '@core/models/common/layout.store';
import { Injectable } from '@angular/core';
import { defineConfig } from '@core/helpers/layout.define-config';

@Injectable()
export class LayoutStoreService {
   private readonly layoutState: Observable<LayoutState>;
   private _layoutState: BehaviorSubject<LayoutState>;
   private readonly initialLayoutState: LayoutState = defineConfig.layout;

   constructor() {
      this._layoutState = new BehaviorSubject(this.initialLayoutState);
      this.layoutState = this._layoutState.asObservable();
   }

   get windowInnerHeight(): Observable<number> {
      return <Observable<number>>this.layoutState.pipe(pluck('windowInnerHeight'), distinctUntilChanged());
   }

   get windowInnerWidth(): Observable<number> {
      return <Observable<number>>this.layoutState.pipe(pluck('windowInnerWidth'), distinctUntilChanged());
   }

   get isSidebarCollapsed(): Observable<boolean> {
      return <Observable<boolean>>this.layoutState.pipe(pluck('isSidebarCollapsed'), distinctUntilChanged());
   }

   get isSidebarExpandOnOver(): Observable<boolean> {
      return <Observable<boolean>>this.layoutState.pipe(pluck('isSidebarExpandOnOver'), distinctUntilChanged());
   }

   get isSidebarMouseOver(): Observable<boolean> {
      return <Observable<boolean>>this.layoutState.pipe(pluck('isSidebarMouseOver'), distinctUntilChanged());
   }

   get isSidebarMini(): Observable<boolean> {
      return <Observable<boolean>>this.layoutState.pipe(pluck('isSidebarMini'), distinctUntilChanged());
   }

   get sidebarMenu(): Observable<Array<any>> {
      return <Observable<Array<any>>>this.layoutState.pipe(pluck('sidebarMenu'), distinctUntilChanged());
   }

   get sidebarMenuActiveUrl(): Observable<string> {
      return <Observable<string>>this.layoutState.pipe(pluck('sidebarMenuActiveUrl'), distinctUntilChanged());
   }

   get sidebarElementHeight(): Observable<number> {
      return <Observable<number>>this.layoutState.pipe(pluck('sidebarElementHeight'), distinctUntilChanged());
   }

   get layout(): Observable<string> {
      return <Observable<string>>this.layoutState.pipe(pluck('layout'), distinctUntilChanged());
   }

   get skin(): Observable<string> {
      return <Observable<string>>this.layoutState.pipe(pluck('skin'), distinctUntilChanged());
   }

   get wrapperClasses(): Observable<string> {
      return <Observable<string>>this.layoutState.pipe(pluck('wrapperClasses'), distinctUntilChanged());
   }

   public sidebarCollapsed(value?: boolean): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { isSidebarCollapsed: value })
      );
   }

   public sidebarExpandOnOver(value?: boolean): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { isSidebarExpandOnOver: value })
      );
   }

   public setSidebarElementHeight(value: number): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { sidebarElementHeight: value })
      );
   }

   public sidebarMouseOver(value?: boolean): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { isSidebarMouseOver: value })
      );
   }

   public sidebarMini(value?: boolean): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { isSidebarMini: value })
      );
   }

   public setSidebarMenu(value: Array<any>): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { sidebarMenu: value })
      );
   }

   public setSidebarMenuActiveUrl(value: string): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { sidebarMenuActiveUrl: value })
      );
   }

   public setLayout(value: string): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { layout: value })
      );
   }

   public setSkin(value: string): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { skin: value })
      );
   }

   public setWrapperClasses(value: string): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { wrapperClasses: value })
      );
   }

   public setWindowInnerHeight(value: number): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { windowInnerHeight: value })
      );
   }

   public setWindowInnerWidth(value: number): void {
      this._layoutState.next(
         Object.assign(this._layoutState.value, { windowInnerWidth: value })
      );
   }
}