import dayjs from "dayjs";
import { transformI18n } from "@/plugins/i18n";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import {
  getShopRenewalListApi,
  renewApproveApi,
  renewDisapproveApi,
  renewCancelApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function useRole(treeRef: Ref) {
  const form = reactive({
    shopId: "",
    type: "",
    state: ""
  });
  const currentPage = ref(1);
  const currentSize = ref(10);
  const curRow = ref();
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
  const typeList = ref([
    {
      id: 101,
      name: "赠送"
    },
    {
      id: 102,
      name: "刷卡"
    },
    {
      id: 103,
      name: "汇款"
    },
    {
      id: 104,
      name: "现金"
    }
  ]);
  const stateList = ref([
    {
      id: 101,
      name: "待审批"
    },
    {
      id: 102,
      name: "审批通过"
    },
    {
      id: 103,
      name: "审批不通过"
    },
    {
      id: 104,
      name: "取消"
    }
  ]);
  const columns: TableColumnList = [
    {
      label: "门店",
      prop: "shop.name"
    },
    {
      label: "金额",
      prop: "amount",
      cellRenderer: ({ row }) => {
        return h("div", row.amount);
      }
    },
    {
      label: "类型",
      prop: "type",
      cellRenderer: ({ row, props }) => (
        <el-tag type={"success"} size={props.size}>
          {typeList.value.find(item => item.id === row.type)?.name}
        </el-tag>
      )
    },
    {
      label: "状态",
      prop: "state",
      cellRenderer: ({ row, props }) => (
        <el-tag
          type={[
            {
              101: "info",
              102: "success",
              103: "danger",
              104: "warning"
            }[row.state]
          ]}
          size={props.size}
        >
          {stateList.value.find(item => item.id === row.state)?.name}
        </el-tag>
      )
    },
    {
      label: "结束日期",
      prop: "endDate",
      minWidth: 160
      // formatter: ({ endDate }) => dayjs(endDate).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "申请人",
      prop: "creator.name"
    },
    {
      label: "创建时间",
      prop: "createdAt",
      minWidth: 160,
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "审批人",
      prop: "auditor.name"
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "操作",
      fixed: "right",
      width: 350,
      slot: "operation"
    }
  ];
  const renewApprove = (row: any) => {
    ElMessageBox.confirm(
      `确认要<strong>通过</strong><strong style='color:var(--el-color-primary)'>${row?.shop?.name}</strong>吗?`,
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
        renewApproveApi({ shopId: row.shopId, renewId: row.id }).then(res => {
          if (res) {
            message(`已通过续费${row?.shop?.name}`, {
              type: "success"
            });
            onSearch(); // 刷新表格数据
          }
        });
      })
      .catch(() => {
        console.log("通过");
      });
  };
  const renewDisapprove = (row: any) => {
    ElMessageBox.confirm(
      `确认要<strong>驳回</strong><strong style='color:var(--el-color-primary)'>${row?.shop?.name}</strong>吗?`,
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
        renewDisapproveApi({ shopId: row.shopId, renewId: row.id }).then(
          res => {
            if (res) {
              message(`已驳回续费${row?.shop?.name}`, {
                type: "success"
              });
              onSearch(); // 刷新表格数据
            }
          }
        );
      })
      .catch(() => {
        console.log("驳回");
      });
  };
  const cancelRenewal = (row: any) => {
    console.log(row);
    ElMessageBox.confirm(
      `确认要<strong>取消</strong><strong style='color:var(--el-color-primary)'>${row?.shop?.name}</strong>吗?`,
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
        renewCancelApi({ shopId: row.shopId, renewId: row.id }).then(res => {
          if (res) {
            message(`已取消续费${row?.shop?.name}`, {
              type: "success"
            });
            onSearch(); // 刷新表格数据
          }
        });
      })
      .catch(() => {
        console.log("取消");
      });
  };
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
    const { data } = await getShopRenewalListApi({
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

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
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
    typeList,
    stateList,
    // buttonClass,
    onSearch,
    resetForm,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    cancelRenewal,
    renewApprove,
    renewDisapprove
  };
}
