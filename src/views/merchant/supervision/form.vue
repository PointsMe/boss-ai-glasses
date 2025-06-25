<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import {
  getCountryListApi,
  getProvinceListApi,
  uploadFileApi
} from "@/api/user";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    logoUrl: "",
    name: "",
    code: "",
    piva: "",
    countryId: "",
    provinceId: "",
    city: "",
    address: "",
    zipcode: "",
    contactName: "",
    contactPhone: "",
    description: "",
    managerAccount: "",
    managerPassword: "",
    vatNumber: "",
    taxCode: ""
  })
});
const countryList = ref([]);
const provinceList = ref([]);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  console.log("ruleFormRef.value", newFormInline.value);
  return ruleFormRef.value;
}
const getCountryList = async () => {
  const res = await getCountryListApi();
  if (res) {
    countryList.value = res.data;
  }
};
const changeCountry = (e: string) => {
  getProvinceList(e);
};

const getProvinceList = async (id: string) => {
  const params = new FormData();
  params.append("countryId", id);
  const res = await getProvinceListApi(params);
  if (res) {
    provinceList.value = res.data;
  }
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log("uploadFile", uploadFile);
  newFormInline.value.logoUrl = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const handleUpload = async (options: any) => {
  console.log("options", options);
  const params = new FormData();
  params.append("image", options.file);
  const res = await uploadFileApi(params);
  console.log("res", res);
  if (res && res.code === 20000) {
    newFormInline.value.logoUrl = res.data.url;
    console.log("newFormInline.value.logoUrl", newFormInline.value.logoUrl);
  }
};

onMounted(() => {
  getCountryList();
});
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="120px"
  >
    <el-row>
      <el-col :span="24" class="upload-col-my">
        <el-form-item label="LOGO">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
          >
            <img
              v-if="newFormInline.logoUrl"
              :src="newFormInline.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入编号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="P.IVA" prop="piva">
          <el-input
            v-model="newFormInline.piva"
            clearable
            placeholder="请输入P.IVA"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="增值税号" prop="vatNumber">
          <el-input
            v-model="newFormInline.vatNumber"
            clearable
            placeholder="请输入增值税号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="税号">
          <el-input
            v-model="newFormInline.taxCode"
            clearable
            placeholder="请输入税号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="国家" prop="countryId">
          <el-select
            v-model="newFormInline.countryId"
            placeholder="请选择国家"
            clearable
            @change="changeCountry"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="省份" prop="provinceId">
          <el-select
            v-model="newFormInline.provinceId"
            placeholder="请选择省份"
            clearable
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="城市" prop="city">
          <el-input v-model="newFormInline.city" placeholder="请输入城市" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="邮编" prop="zipcode">
          <el-input
            v-model="newFormInline.zipcode"
            clearable
            placeholder="请输入zipCode"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="newFormInline.address"
            placeholder="请输入地址"
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="联系人" prop="contactName">
          <el-input
            v-model="newFormInline.contactName"
            clearable
            placeholder="请输入联系人"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="电话" prop="contactPhone">
          <el-input
            v-model="newFormInline.contactPhone"
            clearable
            placeholder="请输入电话"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            clearable
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-col>

      <el-col v-if="!newFormInline.id" :span="24">
        <el-form-item label="管理者账号" prop="managerAccount">
          <el-input
            v-model="newFormInline.managerAccount"
            clearable
            placeholder="请输入管理者账号"
          />
        </el-form-item>
      </el-col>

      <el-col v-if="!newFormInline.id" :span="24">
        <el-form-item label="管理者密码" prop="managerPassword">
          <el-input
            v-model="newFormInline.managerPassword"
            clearable
            type="password"
            placeholder="请输入管理者密码"
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
