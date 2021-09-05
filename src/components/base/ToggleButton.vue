<template>
    <button
        @click="handleButtonClick"
        :class="[
            btnClass,
            active ? activeBtn : inactiveBtn,
            className
        ]"
    >{{text}}</button>
</template>

<script>    

export default {
    name: "ToggleButton",
    props: {
        initStatus: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            active: this.initStatus,
            btnClass: [
                'p-2',
                'font-bold',
                'uppercase',
                'focus:outline-none',
                'rounded-sm',
                'text-tiny',
                'bg-gray-150',
                'dark:hover:bg-gray-750',
                'dark:hover:text-gray-300'
            ].join(' '),
            activeBtn: [
                'text-white',
                'bg-gray-500',
                'dark:text-white',
                'dark:bg-gray-700'
            ].join(' '),
            inactiveBtn: [
                'hover:bg-gray-200',
                'hover:text-grey-600',
                'text-gray-500',
                'dark:text-gray-400',
                'dark:bg-gray-800'
            ].join(' ')
        }
    },
    methods: {
        handleButtonClick(evt) {
            evt.stopPropagation()
            this.active = !this.active
            this.$emit('onClick', this.active)
        }
    }
}
</script>
