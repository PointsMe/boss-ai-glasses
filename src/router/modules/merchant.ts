const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "MerchantIndex",
  component: Layout,
  redirect: "/merchant/index",
  meta: {
    icon: "ep/collection",
    title: "商家",
    rank: 2,
    showLink: true
  },
  children: [
    {
      path: "/merchant/index",
      name: "Merchant",
      component: () => import("@/views/merchant/supervision/index.vue"),
      meta: {
        title: "商家",
        showLink: true
      }
    }
  ]
} satisfies RouteConfigsTable;
