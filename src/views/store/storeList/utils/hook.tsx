import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { usePublicHooks } from "../../hooks";
import { deviceDetection } from "@pureadmin/utils";
import {
  getShopList,
  addShop,
  getShopDetailApi,
  getMerchantDetail,
  updateShop,
  enableShopStatus,
  disableShopStatus,
  updateShopRenewalApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";
import { ElMessageBox } from "element-plus";
import renewalDialog from "../renewalDialog.vue";
import { useRoute } from "vue-router";

export function useRole(treeRef: Ref) {
  const route = useRoute();
  const { merchantId } = route.query;
  const form = reactive({
    name: "",
    merchantId: merchantId ?? ""
  });
  const currentPage = ref(1);
  const currentSize = ref(10);
  const curRow = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  function onChange({ row }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        !row.enabled ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>门店吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        const params = new FormData();
        params.append("id", row.id);
        if (row.enabled) {
          enableShopStatus(params).then(() => {
            onSearch();
            message("已成功启用门店", {
              type: "success"
            });
          });
        } else {
          disableShopStatus(params).then(() => {
            onSearch();
            message("已成功禁用门店", {
              type: "success"
            });
          });
        }
        // switchLoadMap.value[index] = Object.assign(
        //   {},
        //   switchLoadMap.value[index],
        //   {
        //     loading: true
        //   }
        // );
        // setTimeout(() => {
        //   switchLoadMap.value[index] = Object.assign(
        //     {},
        //     switchLoadMap.value[index],
        //     {
        //       loading: false
        //     }
        //   );
        //   message("已成功修改用户状态", {
        //     type: "success"
        //   });
        // }, 300);
      })
      .catch(() => {
        row.enabled = !row.enabled;
      });
  }
  const columns: TableColumnList = [
    {
      label: "商家名称",
      prop: "merchant.name"
    },
    {
      label: "门店",
      prop: "name"
    },
    {
      label: "报错次数",
      prop: "errorCount",
      slot: "errorCount"
    },
    {
      label: "申报次数",
      prop: "disputeCount",
      slot: "disputeCount"
    },
    {
      label: "违规次数",
      prop: "violationCount",
      slot: "violationCount"
    },
    {
      label: "地址信息",
      prop: "address",
      cellRenderer: ({ row }) => (
        <div>
          <div>
            <span>{row.address.country?.name}</span>-
            <span>{row.address.province?.name}</span>-
            <span>{row.address.city}</span>
          </div>
          <div>
            <span>{row.address.address}</span>
          </div>
        </div>
      )
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "状态",
      prop: "enabled",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enabled}
          active-value={true}
          inactive-value={false}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    currentSize.value = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    currentPage.value = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }
  async function onSearch() {
    loading.value = true;
    const { data } = await getShopList({
      ...toRaw(form),
      page: currentPage.value,
      size: currentSize.value
    });
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  async function openDialogOne(row?: any) {
    console.log("row", row);
    addDialog({
      title: `续费门店`,
      props: {
        formInline: {
          shopId: row?.id ?? "",
          type: row?.type ?? "",
          endDate: row?.endDate ?? "",
          amount: row?.amount ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(renewalDialog, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        console.log("options", options);
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", FormRef, curData);
            updateShopRenewalApi({
              shopId: row?.id ?? "",
              type: curData.type,
              endDate: curData.endDate,
              amount: curData.amount,
              remark: curData.remark
            }).then(() => {
              message("新增续费成功", {
                type: "success"
              });
              done();
            });
          } else {
            message("请填写完整信息", {
              type: "error"
            });
          }
        });
      }
    });
  }
  async function openDialog(title = "新增", row?: any) {
    let res = null;
    let data = null;
    if (row) {
      const params = new FormData();
      params.append("id", row?.id);
      res = await getShopDetailApi(params);
      data = res.data;
    }
    console.log("res==>", data);
    addDialog({
      title: `${title}门店`,
      props: {
        formInline: {
          id: data?.id ?? "",
          merchantId: data?.merchantId ?? "",
          name: data?.name ?? "",
          code: data?.code ?? "",
          countryId: data?.address?.country?.id ?? "",
          provinceId: data?.address?.province?.id ?? "",
          city: data?.address?.city ?? "",
          address: data?.address?.address ?? "",
          contactName: data?.address?.contactName ?? "",
          contactPhone: data?.address?.contactPhone ?? "",
          zipcode: data?.address?.zipcode ?? "",
          description: data?.description ?? "",
          logoUrl: data?.logoUrl ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        function chores() {
          message(`您${title}了门店名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", FormRef, curData);
            getMerchantDetail({ id: curData.merchantId }).then(result => {
              console.log("res", result);
              // 表单规则校验通过
              if (title === "新增") {
                // 实际开发先调用新增接口，再进行下面操作
                addShop({
                  name: curData.name,
                  merchantId: curData.merchantId,
                  enabled: true,
                  type: 101,
                  logoUrl: curData.logoUrl,
                  company: {
                    ...result.data?.company,
                    countryId: result.data?.company?.country?.id,
                    provinceId: result.data?.company?.province?.id
                  },
                  address: {
                    ...curData
                  },
                  description: curData.description
                }).then(() => {
                  chores();
                });
              } else {
                // 实际开发先调用修改接口，再进行下面操作
                updateShop({
                  id: data?.id ?? "",
                  name: curData.name,
                  merchantId: curData.merchantId,
                  enabled: true,
                  type: 101,
                  logoUrl: curData.logoUrl,
                  company: {
                    ...data?.company,
                    countryId: data?.company?.country?.id,
                    provinceId: data?.company?.province?.id
                  },
                  address: {
                    ...curData
                  },
                  description: curData.description
                }).then(() => {
                  chores();
                });
              }
            });
          }
        });
      }
    });
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { id, name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(id, treeRef.value.getCheckedKeys());
    message(`角色名称为${name}的菜单权限修改成功`, {
      type: "success"
    });
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleSave,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    openDialogOne
  };
}
