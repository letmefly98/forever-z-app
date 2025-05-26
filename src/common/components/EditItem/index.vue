<script setup lang="ts">
import { EditPen } from '@element-plus/icons-vue'
import { computed, ref, unref, watch } from 'vue'

interface Props {
  modelValue?: any
  autoClose?: boolean
  controlType?: 'input' | 'input-number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  controlAttrs?: any
  controlOptions?: ({ value: any, label: string })[]
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  autoClose: true,
  controlType: 'input',
  controlAttrs: () => ({}),
  controlOptions: () => [],
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'start'): void
  (e: 'cancel'): void
  (e: 'confirm', value: Props['modelValue'], close: VoidFunction): void
}>()
defineSlots<{
  default: (props: { value: Props['modelValue'], label: string }) => any
  control: (props: { value: Props['modelValue'], label: string }) => any
  buttons: (props: { editing: boolean }) => any
}>()
defineExpose({
  start,
  close,
})

const editing = ref(false)
const form = ref(props.modelValue)
watch(() => props.modelValue, value => form.value = value)

const shownValue = computed(() => {
  const direct = ['input', 'input-number', 'textarea'].includes(props.controlType)
  if (direct) return form.value
  const value = Array.isArray(form.value) ? form.value : [form.value]
  const match = props.controlOptions.filter(e => value.includes(e.value))
  return match ? match.map(e => e.label).join(',') : ''
})

// 开始编辑
function start() {
  editing.value = true
}

// 关闭编辑
function close() {
  form.value = props.modelValue
  editing.value = false
}

function handleStartEdit() {
  start()
  emit('start')
}

function handleCloseEdit() {
  close()
  emit('cancel')
}

function handleConfirm() {
  const value = unref(form)
  if (props.autoClose) close()
  emit('update:modelValue', value)
  emit('confirm', value, close)
}
</script>

<template>
  <div class="edit-item" :class="{ editing }">
    <div class="wrapper">
      <template v-if="!editing">
        <slot :value="props.modelValue" :label="shownValue">
          <div class="value">
            {{ shownValue }}
          </div>
        </slot>
      </template>
      <template v-else>
        <slot name="control" :value="props.modelValue" :label="shownValue">
          <div class="control">
            <template v-if="props.controlType === 'input'">
              <el-input v-model="form" v-bind="props.controlAttrs" />
            </template>
            <template v-else-if="props.controlType === 'input-number'">
              <el-input-number v-model="form" v-bind="props.controlAttrs" />
            </template>
            <template v-else-if="props.controlType === 'textarea'">
              <el-input v-model="form" type="textarea" v-bind="props.controlAttrs" />
            </template>
            <template v-else-if="props.controlType === 'select'">
              <el-select v-model="form" v-bind="props.controlAttrs">
                <template v-for="p in props.controlOptions" :key="p.value">
                  <el-option :value="p.value" :label="p.label" />
                </template>
              </el-select>
            </template>
            <template v-else-if="props.controlType === 'checkbox'">
              <el-checkbox-group v-model="form">
                <template v-for="p in props.controlOptions" :key="p.value">
                  <el-checkbox :label="p.value">
                    {{ p.label }}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </template>
            <template v-else-if="props.controlType === 'radio'">
              <el-radio-group v-model="form">
                <template v-for="p in props.controlOptions" :key="p.value">
                  <el-radio :label="p.value">
                    {{ p.label }}
                  </el-radio>
                </template>
              </el-radio-group>
            </template>
          </div>
        </slot>
      </template>
    </div>
    <div class="buttons">
      <slot name="buttons" :editing="editing">
        <template v-if="!editing">
          <el-button link class="btn-edit" @click="handleStartEdit">
            <i class="el-icon"><EditPen /></i>
          </el-button>
        </template>
        <template v-else>
          <el-button link class="btn-cancel" @click="handleCloseEdit">
            取消
          </el-button>
          <el-button link class="btn-submit" @click="handleConfirm">
            确认
          </el-button>
        </template>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.edit-item {
  --edit-item-gap: 8px;
  --edit-item-buttons-gap: 8px;
  display: flex;
  align-items: center;
  gap: var(--edit-item-gap);

  :deep(.el-button + .el-button) {
    margin-left: var(--edit-item-buttons-gap);
  }
}
</style>
