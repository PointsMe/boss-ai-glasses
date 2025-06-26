import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  merchantId: [{ required: true, message: "此项为必填项", trigger: "change" }],
  code: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  name: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  countryId: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  provinceId: [{ required: true, message: "此项为必填项", trigger: "change" }],
  city: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  address: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  contactName: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  contactPhone: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  zipcode: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  description: [{ required: true, message: "此项为必填项", trigger: "blur" }]
});
export const renewalFormRules = reactive(<FormRules>{
  type: [{ required: true, message: "此项为必填项", trigger: "change" }],
  amount: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  endDate: [{ required: true, message: "此项为必填项", trigger: "blur" }],
  remark: [{ required: true, message: "此项为必填项", trigger: "blur" }]
});
