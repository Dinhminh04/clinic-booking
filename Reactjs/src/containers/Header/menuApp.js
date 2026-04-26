export const adminMenu = [
  {
    name: "menu.system.header",
    menus: [
      {
        name: "menu.system.system-administrator.header",
        subMenus: [
          {
            name: "menu.system.system-administrator.user-manage",
            link: "/system/user-manage",
          },
          {
            name: "menu.system.system-administrator.product-manage",
            link: "/system/product-manage",
          },
          {
            name: "menu.system.system-administrator.register-package-group-or-account",
            link: "/system/register-package-group-or-account",
          },
        ],
      },
      {
        name: "menu.system.medcare.header",
        subMenus: [
          {
            name: "menu.system.medcare.doctor-manage",
            link: "/system/doctor-manage",
          },
          {
            name: "menu.system.medcare.clinic-manage",
            link: "/system/clinic-manage",
          },
          {
            name: "menu.system.medcare.specialty-manage",
            link: "/system/specialty-manage",
          },
        ],
      },
    ],
  },
];
