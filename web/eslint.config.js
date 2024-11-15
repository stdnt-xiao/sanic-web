import globals from 'globals'
import { defineFlatConfig ***REMOVED*** from 'eslint-define-config'

import * as parserTypeScript from '@typescript-eslint/parser'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'

import * as parserVue from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'

import stylistic from '@stylistic/eslint-plugin'

function renameRules(rules, map***REMOVED*** {
  return Object.fromEntries(
    Object.entries(rules***REMOVED***.map(([key, value]***REMOVED*** => {
      for (const [from, to] of Object.entries(map***REMOVED******REMOVED*** {
        if (key.startsWith(`${from***REMOVED***/`***REMOVED******REMOVED***
          return [to + key.slice(from.length***REMOVED***, value]
      ***REMOVED***
      return [key, value]
    ***REMOVED******REMOVED***
  ***REMOVED***
***REMOVED***

export default defineFlatConfig([
***REMOVED***
    ignores: [
      'public',
      'build',
      'dist',
      'node_modules',
      'coverage',
      'src/assets/**'
***REMOVED***
  ***REMOVED***,
***REMOVED***
    plugins: {
      '@stylistic': stylistic
    ***REMOVED***,
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/template-curly-spacing': ['error', 'always'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/object-curly-newline': ['error', {
        'ObjectExpression': {
          // 如果对象有属性，则要求换行。空对象则忽略
          'minProperties': 1,
          // 保持一致性
          'consistent': true
        ***REMOVED***
      ***REMOVED***],
      '@stylistic/object-property-newline': 'error',
      '@stylistic/key-spacing': ['error', {
        'beforeColon': false,
        'afterColon': true
      ***REMOVED***],
      '@stylistic/type-annotation-spacing': ['error', {
        'before': true,
        'after': true,
        'overrides': {
          'colon': {
            'before': false,
            'after': true
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***],
      '@stylistic/no-trailing-spaces': ['error']
    ***REMOVED***
  ***REMOVED***,
***REMOVED***
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        ...globals.node,
        ...globals.es2021,
        ...globals.browser
      ***REMOVED***,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        ***REMOVED***,
        ecmaVersion: 2022,
        sourceType: 'module'
      ***REMOVED***,
      sourceType: 'module'
    ***REMOVED***,
    rules: {
      'accessor-pairs': ['error', {
        enforceForClassMembers: true,
        setWithoutGet: true
      ***REMOVED***],
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'comma-spacing': ['error', {
        after: true,
        before: false
      ***REMOVED***],
      'constructor-super': 'error',
      'default-case-last': 'error',
      'dot-notation': ['error', {
        allowKeywords: true
      ***REMOVED***],
      'eqeqeq': ['error', 'always'],
      'new-cap': ['error', {
        capIsNew: false,
        newIsCap: true,
        properties: true
      ***REMOVED***],
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-async-promise-executor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-console': ['error', {
        allow: ['log', 'warn', 'error']
      ***REMOVED***],
      'no-const-assign': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': ['error', {
        allowEmptyCatch: true
      ***REMOVED***],
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-import-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', {
        allowLoop: false,
        allowSwitch: false
      ***REMOVED***],
      'no-lone-blocks': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-multi-str': 'error',
      'no-new': 'off',
      'no-new-func': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': ['error', {
        builtinGlobals: false
      ***REMOVED***],
      'no-regex-spaces': 'error',
      'no-restricted-globals': [
        'error',
      ***REMOVED***
          message: 'Use `globalThis` instead.',
          name: 'global'
        ***REMOVED***,
      ***REMOVED***
          message: 'Use `globalThis` instead.',
          name: 'self'
        ***REMOVED***
  ***REMOVED***,
      'no-restricted-properties': [
        'error',
      ***REMOVED***
          message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
          property: '__proto__'
        ***REMOVED***,
      ***REMOVED***
          message: 'Use `Object.defineProperty` instead.',
          property: '__defineGetter__'
        ***REMOVED***,
      ***REMOVED***
          message: 'Use `Object.defineProperty` instead.',
          property: '__defineSetter__'
        ***REMOVED***,
      ***REMOVED***
          message: 'Use `Object.getOwnPropertyDescriptor` instead.',
          property: '__lookupGetter__'
        ***REMOVED***,
      ***REMOVED***
          message: 'Use `Object.getOwnPropertyDescriptor` instead.',
          property: '__lookupSetter__'
        ***REMOVED***
  ***REMOVED***,
      'no-restricted-syntax': [
        'error',
        'DebuggerStatement',
        'LabeledStatement',
        'WithStatement',
        'TSEnumDeclaration[const=true]',
        'TSExportAssignment'
  ***REMOVED***,
      'no-self-assign': ['error', {
        props: true
      ***REMOVED***],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', {
        defaultAssignment: false
      ***REMOVED***],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true
      ***REMOVED***],
      'no-unused-vars': ['error', {
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all'
      ***REMOVED***],
      'no-use-before-define': ['error', {
        classes: false,
        functions: false,
        variables: false
      ***REMOVED***],
      'no-useless-backreference': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-with': 'error',
      'space-infix-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': [
        'error',
        'always',
      ***REMOVED***
          avoidQuotes: true,
          ignoreConstructors: false
        ***REMOVED***
  ***REMOVED***,
      'one-var': ['error', {
        initialized: 'never'
      ***REMOVED***],
      'prefer-arrow-callback': [
        'error',
      ***REMOVED***
          allowNamedFunctions: false,
          allowUnboundThis: true
        ***REMOVED***
  ***REMOVED***,
      'prefer-const': [
        'error',
      ***REMOVED***
          destructuring: 'all',
          ignoreReadBeforeAssign: true
        ***REMOVED***
  ***REMOVED***,
      'prefer-exponentiation-operator': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': ['error', {
        disallowRedundantWrapping: true
      ***REMOVED***],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'sort-imports': [
        'error',
      ***REMOVED***
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
        ***REMOVED***
  ***REMOVED***,

      // https://cn.eslint.org/docs/rules/no-trailing-spaces
      'no-trailing-spaces': 2, // 禁用行尾空白
      'comma-style': ['error', 'last'],
      'comma-dangle': ['error', 'never'],
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': [
        2,
      ***REMOVED***
          max: 2
        ***REMOVED***
  ***REMOVED***,
      // https://cn.eslint.org/docs/rules/eol-last
      'eol-last': 2,
      'quotes': [
        'error',
        'single',
      ***REMOVED***
          avoidEscape: true,
          allowTemplateLiterals: true
        ***REMOVED***
  ***REMOVED***
    ***REMOVED***
  ***REMOVED***,
***REMOVED***
    files: ['**/*.vue', '**/*.?([cm]***REMOVED***ts', '**/*.?([cm]***REMOVED***tsx'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***,
    settings: {
      'import/core-modules': [
        'uno.css'
  ***REMOVED***
    ***REMOVED***,
    plugins: {
      '@typescript-eslint': pluginTypeScript
    ***REMOVED***,
    rules: {
      ...renameRules(
        pluginTypeScript.configs['eslint-recommended'].overrides[0].rules,
      ***REMOVED***
          '@typescript-eslint': 'ts'
        ***REMOVED***
      ***REMOVED***,
      ...pluginTypeScript.configs.recommended.rules,
      '@typescript-eslint/indent': ['error', 2, {
        SwitchCase: 1
      ***REMOVED***],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 1,
      '@typescript-eslint/member-delimiter-style': [
        'error',
      ***REMOVED***
          multiline: {
            delimiter: 'none',
            requireLast: false
          ***REMOVED***,
          singleline: {
            delimiter: 'semi',
            requireLast: true
          ***REMOVED***
        ***REMOVED***
  ***REMOVED***,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/consistent-type-imports': ['error', {
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: false
      ***REMOVED***]
    ***REMOVED***
  ***REMOVED***,
***REMOVED***
    files: ['*.d.ts'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'import/no-duplicates': 'off',
      'unused-imports/no-unused-vars': 'off'
    ***REMOVED***
  ***REMOVED***,

***REMOVED***
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        ecmaVersion: 2022,
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true
        ***REMOVED***,
        extraFileExtensions: ['.vue']
      ***REMOVED***
    ***REMOVED***,
    plugins: {
      vue: pluginVue
    ***REMOVED***,
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs['vue3-essential'].rules,
      ...pluginVue.configs['vue3-strongly-recommended'].rules,
      ...pluginVue.configs['vue3-recommended'].rules,
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 0,
      'vue/singleline-html-element-content-newline': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/no-unused-components': 1,
      'vue/no-mutating-props': 0,
      'vue/v-on-event-hyphenation': ['warn', 'always', {
        autofix: true
      ***REMOVED***],
      'vue/block-order': ['error', {
        'order': ['script', 'template', 'style']
      ***REMOVED***],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/script-setup-uses-vars': 'error',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'never',
          component: 'always'
        ***REMOVED***,
        svg: 'always',
        math: 'always'
      ***REMOVED***]
    ***REMOVED***
  ***REMOVED***
]***REMOVED***
