export interface LayoutState {
   isSidebarCollapsed?: boolean;
   isSidebarExpandOnOver?: boolean;
   isSidebarMouseOver?: boolean;
   isSidebarMini?: boolean;

   sidebarElementHeight?: number;
   sidebarMenu?: Array<Object>;
   sidebarMenuActiveUrl?: string;
   sidebarSkin?: string;

   layout?: string;

   skin?: string;

   windowInnerHeight?: number;
   windowInnerWidth?: number;
}
