export const defineConfig = {
   social: {
      facebookId: '303001537360379',
      googleId: '754115784175-o3en20j5bff7c241drhc33q4jgnqiovc.apps.googleusercontent.com'
   },
   layout: {
      skin: 'blue',
      isSidebarCollapsed: false,
      isSidebarExpandOnOver: false,
      isSidebarMouseOver: false,
      isSidebarMini: true,
      sidebarSkin: 'dark',
      layout: 'normal',
      sidebarMenuActiveUrl: '',
      sidebarMenu: [
         {
            label: 'NAVEGACIÓN PRINCIPAL',
            separator: true
         },
         {
            label: 'Infectados',
            route: '/infected',
            iconClasses: 'fa fa-globe',
            pullRights: [
               {
                  text: 'New',
                  classes: 'label pull-right bg-green'
               }
            ]
         },
         // {
         //    label: 'Layout',
         //    iconClasses: 'fa fa-th-list',
         //    children: [
         //       { label: 'Configuration', route: 'layout/configuration' },
         //       { label: 'Custom', route: 'layout/custom' },
         //       { label: 'Header', route: 'layout/header' },
         //       { label: 'Sidebar Left', route: 'layout/sidebar-left' },
         //       { label: 'Sidebar Right', route: 'layout/sidebar-right' },
         //       { label: 'Content', route: 'layout/content' }
         //    ]
         // }
      ]
   }
};
