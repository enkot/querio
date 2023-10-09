import { emit, size } from './SplitPane.vue';

export function onResized(event: any) {
// size.value = event.at(0).size
emit('resized', size.value);
}
