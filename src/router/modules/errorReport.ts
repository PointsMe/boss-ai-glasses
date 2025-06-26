const Layout = () => import("@/layout/index.vue");

export default {
  path: "/errorReport",
  name: "ErrorReportIndex",
  component: Layout,
  redirect: "/errorReport/index",
  meta: {
    icon: "ep/collection",
    title: "报错记录",
    rank: 5
  },
  children: [
    {
      path: "/errorReport/index",
      name: "ErrorReport",
      component: () => import("@/views/merchant/errorReport/index.vue"),
      meta: {
        title: "报错记录",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
