<template>
  <BasicModal destroyOnClose width="1400px" :title="props.title" :canFullscreen="false" :centered="true" :showOkBtn="false" cancelText="关闭" :cancelText="'关闭'">
    <BasicTable
      :columns="columns"
      :dataSource="BasicData"
      :ellipsis="false"
      :striped="true"
      :pagination="false"
    >
    </BasicTable>
    <template #footer>
    </template>
  </BasicModal>
</template>

<script lang="ts"  setup>
import BasicModal from "/@/components/Modal/src/BasicModal.vue";
import {BasicTable} from '/@/components/Table';
import { ref, watch } from "vue";

let BasicData = ref([])
let columns = ref([])
const props = defineProps({
  userData: { type: Object },
  title: { type: String }
});

watch(() => props.userData, () => {
  if (props.userData) {
    BasicData.value = props.userData.data
    columns.value = props.userData.columns
  }
}, { immediate: true, deep: true });
</script>

<style scoped>

</style>
