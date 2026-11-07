import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**']
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.recommended,
    eslintConfigPrettier
)
