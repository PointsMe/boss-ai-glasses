import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
// import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  addShop,
  getShopDetailApi,
  getMerchantDetail,
  updateShop,
  getMerchantListApi,
  createMerchantApi,
  updateMerchantApi
} from "@/api/user";
import { type Ref, reactive, ref, onMounted, h, toRaw } from "vue";

export function useRole(treeRef: Ref) {
  const form = reactive({
    name: ""
  });
  const currentPage = ref(1);
  const currentSize = ref(10);
  const curRow = ref();
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
  const columns: TableColumnList = [
    {
      label: "商家名称",
      prop: "name"
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
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "描述",
      prop: "description"
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
    const { data } = await getMerchantListApi({
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
  //   {
  // 	"name": "Visual商家名称001",
  // 	"logoUrl": "http://img.saonian.org/group1/M00/06/78/rBJnoGhJBhuAIIbJAAD_XsBfoL0272.png",
  // 	"description": "联系描述",
  // 	"company": {
  // 		"type": 101,
  // 		"name": "Visual公司名称001",
  // 		"vatNumber": "增值税号",
  // 		"taxCode": "税号",
  // 		"countryId": "800000",
  // 		"provinceId": "804000",
  // 		"city": "太原市",
  // 		"zipcode": "99501",
  // 		"address": "详细地址",
  // 		"houseNumber": "",
  // 		"contactName": "",
  // 		"contactPhone": "",
  // 		"contactEmail": ""
  // 	},
  // 	"employee": {
  // 		"account": "visual001@gmail.com",
  // 		"password": "123456"
  // 	}
  // }
  async function openDialog(title = "新增", row?: any) {
    function loadDialog(data: any) {
      addDialog({
        title: `${title}商家`,
        props: {
          formInline: {
            id: data?.id ?? "",
            logoUrl: data?.logoUrl ?? "",
            name: data?.name ?? "",
            code: data?.code ?? "",
            piva: data?.piva ?? "",
            countryId: data?.address?.country?.id ?? "",
            provinceId: data?.address?.province?.id ?? "",
            city: data?.address?.city ?? "",
            address: data?.address?.address ?? "",
            zipcode: data?.address?.zipcode ?? "",
            contactName: data?.address?.contactName ?? "",
            contactPhone: data?.address?.contactPhone ?? "",
            description: data?.description ?? "",
            managerAccount: data?.employee?.account ?? "",
            managerPassword: data?.employee?.password ?? "",
            vatNumber: data?.company?.vatNumber ?? "",
            taxCode: data?.company?.taxCode ?? ""
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
            message(`您${title}了商家名称为${curData.name}的这条数据`, {
              type: "success"
            });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
          FormRef.validate(valid => {
            if (valid) {
              console.log("curData", options, curData);
              // 表单规则校验通过
              if (title === "新增") {
                // 实际开发先调用新增接口，再进行下面操作
                createMerchantApi({
                  name: curData.name,
                  logoUrl: curData.logoUrl,
                  description: curData.description,
                  company: {
                    type: 101,
                    name: curData.name,
                    code: curData.code,
                    vatNumber: curData.vatNumber,
                    taxCode: curData.taxCode,
                    countryId: curData.countryId,
                    provinceId: curData.provinceId,
                    city: curData.city,
                    zipcode: curData.zipcode,
                    address: curData.address,
                    houseNumber: curData.houseNumber,
                    contactName: curData.contactName,
                    contactPhone: curData.contactPhone,
                    contactEmail: curData.contactEmail
                  },
                  employee: {
                    account: curData.managerAccount,
                    password: curData.managerPassword
                  }
                }).then(() => {
                  chores();
                });
              } else {
                // 实际开发先调用修改接口，再进行下面操作
                updateMerchantApi({
                  id: curData.id,
                  name: curData.name,
                  logoUrl: curData.logoUrl,
                  description: curData.description,
                  company: {
                    type: 101,
                    name: curData.name,
                    code: curData.code,
                    vatNumber: curData.vatNumber,
                    taxCode: curData.taxCode,
                    countryId: curData.countryId,
                    provinceId: curData.provinceId,
                    city: curData.city,
                    zipcode: curData.zipcode,
                    address: curData.address,
                    houseNumber: curData.houseNumber,
                    contactName: curData.contactName,
                    contactPhone: curData.contactPhone,
                    contactEmail: curData.contactEmail
                  },
                  employee: {
                    account: curData.managerAccount,
                    password: curData.managerPassword
                  }
                }).then(() => {
                  chores();
                });
              }
            }
          });
        }
      });
    }
    if (row?.id) {
      const params = new FormData();
      params.append("id", row.id);
      const { data } = await getMerchantDetail(params);
      console.log("data", data);
      loadDialog(data);
    } else {
      loadDialog(null);
    }
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
    handleSelectionChange
  };
}
