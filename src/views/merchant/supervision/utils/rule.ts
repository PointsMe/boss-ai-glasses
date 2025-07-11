import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  code: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  name: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  countryId: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  provinceId: [{ required: true, message: "此项为必填项", trigger: "change" }],
  city: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  address: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  contactName: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  contactPhone: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  zipcode: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  managerAccount: [
    {
      required: true,
      type: "email",
      message: "请输入正确的管理者邮箱",
      trigger: "blur"
    }
  ],
  managerPassword: [
    {
      required: true,
      min: 6,
      max: 32,
      message: "密码长度不能小于6位，不能大于32位",
      trigger: "blur"
    }
  ],
  vatNumber: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  taxCode: [{ required: true, message: "此项为必填项", trigger: "blur" }]
});
