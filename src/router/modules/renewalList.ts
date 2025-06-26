const Layout = () => import("@/layout/index.vue");

export default {
  path: "/renewalList",
  name: "RenewalListIndex",
  component: Layout,
  redirect: "/renewalList/index",
  meta: {
    icon: "ep/setting",
    title: "续费列表",
    rank: 4
  },
  children: [
    {
      path: "/renewalList/index",
      name: "RenewalList",
      component: () => import("@/views/renewalList/index.vue"),
      meta: {
        title: "续费列表",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
