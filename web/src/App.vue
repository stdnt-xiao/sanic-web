<script lang="ts" setup>
import NaiveProvider from './NaiveProvider.vue'
import { dateZhCN, zhCN ***REMOVED*** from 'naive-ui'

const { defaultTheme, themeOverrides ***REMOVED*** = useTheme(***REMOVED***

defineOptions({
    name: 'App'
***REMOVED******REMOVED***
useCopyCode(***REMOVED***
***REMOVED***

***REMOVED***
    <NConfigProvider
        class="h-full"
        :locale="zhCN"
        :date-locale="dateZhCN"
        :theme="defaultTheme"
        :theme-overrides="themeOverrides"
    >
        <NaiveProvider>
            <RouterView />
        </NaiveProvider>
    </NConfigProvider>
***REMOVED***

<style lang="scss">
@use '@/styles/index.scss';
***REMOVED***
