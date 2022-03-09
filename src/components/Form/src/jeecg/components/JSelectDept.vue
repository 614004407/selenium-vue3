<!--部门选择组件-->
<template>
    <div>
        <JSelectBiz @handleOpen="handleOpen"  v-bind="attrs"/>
        <DeptSelectModal @register="regModal" @getSelectResult="setValue" v-bind="getBindValue" />
    </div>
</template>
<script lang="ts">
  import DeptSelectModal from './modal/DeptSelectModal.vue';
  import JSelectBiz from './base/JSelectBiz.vue';
  import { defineComponent, ref, reactive, watchEffect, watch, provide, unref ,toRaw} from 'vue';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { SelectTypes } from 'ant-design-vue/es/select';

  export default defineComponent({
    name: 'JSelectDept',
    components: {
      DeptSelectModal,
      JSelectBiz,
    },
    inheritAttrs: false,
    props: {
      value: propTypes.oneOfType([propTypes.string, propTypes.array]),
    },
    emits: ['options-change', 'change','select','update:value'],
    setup(props, { emit, refs }) {
      const emitData = ref<object>();
      //注册model
      const [regModal, { openModal }] = useModal();
      //表单值
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);
      //下拉框选项值
      const selectOptions = ref<SelectTypes['options']>([]);
      //下拉框选中值
      let selectValues = reactive<object>({
        value: []
      });
      //下发 selectOptions,xxxBiz组件接收
      provide('selectOptions', selectOptions);
      //下发 selectValues,xxxBiz组件接收
      provide('selectValues', selectValues);

      const tag = ref(false);
      const attrs = useAttrs();

      /**
       * 监听组件值
       */
      watchEffect(() => {
        props.value && initValue();
      });

      /**
       * 监听selectValues变化
       */
      watch(selectValues, () => {
        if (selectValues) {
          state.value = selectValues.value;
        }
      });
      /**
       * 监听selectOptions变化
       */
      watch(selectOptions, () => {
        if (selectOptions) {
          emit('select',toRaw(unref(selectOptions)),toRaw(unref(selectValues)))
        }
      });

      /**
       * 打卡弹出框
       */
      function handleOpen() {
        tag.value = true;
        openModal(true, {
          isUpdate: false,
        });
      }

      /**
       * 将字符串值转化为数组
       */
      function initValue() {
        let value = props.value ? props.value : [];
        if (value && typeof value === 'string') {
          state.value = value.split(',');
          selectValues.value = value.split(',');
        }
      }

      /**
       * 设置下拉框的值
       */
      function setValue(options, values) {
        selectOptions.value = options;
        //emitData.value = values.join(",");
        state.value = values;
        selectValues.value = values;
        emit('update:value', values.join(','))
      }
      const getBindValue = Object.assign({}, unref(props), unref(attrs));
      return {
        state,
        attrs,
        selectOptions,
        selectValues,
        getBindValue,
        tag,
        regModal,
        setValue,
        handleOpen,
      };
    },
  });
</script>
<style lang="less" scoped>
    .j-select-row {
        @width: 82px;

        .left {
            width: calc(100% - @width - 8px);
        }

        .right {
            width: @width;
        }

        .full {
            width: 100%;
        }

        ::v-deep(.ant-select-search__field) {
            display: none !important;
        }
    }
</style>