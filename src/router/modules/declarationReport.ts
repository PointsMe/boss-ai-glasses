const Layout = () => import("@/layout/index.vue");

export default {
  path: "/declarationReport",
  name: "DeclarationReportIndex",
  component: Layout,
  redirect: "/declarationReport/index",
  meta: {
    icon: "ep/collection",
    title: "申报记录",
    rank: 6
  },
  children: [
    {
      path: "/declarationReport/index",
      name: "DeclarationReport",
      component: () => import("@/views/merchant/declarationReport/index.vue"),
      meta: {
        title: "申报记录",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
