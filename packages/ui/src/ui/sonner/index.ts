import { registerToastComponents } from '@workspace/core/utils/toast';
import CustomToast from './CustomToast.vue';
import Icon from '@workspace/ui/icon/Icon.vue';

registerToastComponents({ CustomToast, Icon });

export { default as Toaster } from './Sonner.vue';
export { default as CustomToast } from './CustomToast.vue';
