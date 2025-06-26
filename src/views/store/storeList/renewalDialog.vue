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
  let value = newFormInline.value.amount.replace(/[^0-9]/g, "");
  newFormInline.value.amount = value;
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
            type="date"
            style="width: 100%"
            :disabled-date="
              date => date.getTime() < new Date().setHours(0, 0, 0, 0)
            "
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注"
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
    width: 178px !important;
    height: 178px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c8c8c;
      width: 178px;
      height: 178px;
    }
  }
}
</style>
