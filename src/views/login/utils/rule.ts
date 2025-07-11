import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";

/** 密码正则（密码格式应为6-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;

/** 登录校验 */
const loginRules = reactive<FormRules>({
  password: [
    {
      validator: (rule, value, callback) => {
        //  else if (!REGEXP_PWD.test(value)) {
        //   callback(new Error(transformI18n($t("login.purePassWordRuleReg"))));
        // }
        if (value === "") {
          callback(new Error(transformI18n($t("login.purePassWordReg"))));
        } else if (value.length < 6 || value.length > 18) {
          callback(new Error("密码长度不能小于6位，不能大于18位"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
