const Layout = () => import("@/layout/index.vue");

export default {
  path: "/violationReport",
  name: "ViolationReportIndex",
  component: Layout,
  redirect: "/violationReport/index",
  meta: {
    icon: "ep/tickets",
    title: "违规记录",
    rank: 7
  },
  children: [
    {
      path: "/violationReport/index",
      name: "ViolationReport",
      component: () => import("@/views/merchant/violationReport/index.vue"),
      meta: {
        title: "违规记录",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
