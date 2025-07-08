<script setup lang="ts">
import { ref } from "vue";
import { renewalFormRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    shopId: "",
    type: "",
    endDate: "",
    amount: "",
    remark: ""
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
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

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
function handleAmountInput(e) {
  // 只能输入正整数且不能以0开头
  // 只允许输入数字和一个小数点，且小数点不能在开头
  let value = newFormInline.value.amount
    .replace(/[^0-9.]/g, "") // 只保留数字和小数点
    .replace(/^\./, "") // 不允许以小数点开头
    .replace(/\.{2,}/g, ".") // 连续小数点只保留一个
    .replace(/(\.\d*)\./g, "$1"); // 只允许出现一个小数点
  newFormInline.value.amount = value;
}
function disabledDate(date) {
  // 只允许选择明天及以后的日期（不允许选择今天及之前的日期）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() <= today.getTime();
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="renewalFormRules"
    label-width="82px"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item label="续费类型" prop="type">
          <el-select
            v-model="newFormInline.type"
            clearable
            placeholder="请选择续费类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="金额" prop="amount">
          <el-input
            v-model="newFormInline.amount"
            clearable
            type="text"
            placeholder="请输入金额"
            @input="handleAmountInput"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="到期时间" prop="endDate">
          <el-date-picker
            v-model="newFormInline.endDate"
            placeholder="请选择到期时间"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            type="date"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注"
            maxlength="500"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<style scoped lang="scss">
.upload-col-my {
  display: flex;
  justify-content: left;

  :deep(.avatar-uploader) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 178px !important;
    height: 178px !important;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    transition: border-color 0.3s;

    .avatar {
      display: block;
      width: 178px;
      height: 178px;
    }

    .avatar-uploader-icon {
      width: 178px;
      height: 178px;
      font-size: 28px;
      color: #8c8c8c;
    }
  }
}
</style>
