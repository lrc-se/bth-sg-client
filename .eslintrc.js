// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "eol-last": 2,
        "no-trailing-spaces": 0,
        "semi": [
            2,
            "always"
        ],
        "camelcase": [
            2,
            {
                "properties": "never"
            }
        ],
        "curly": [
            2,
            "all"
        ],
        "brace-style": [
            2,
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "no-with": 2,
        "keyword-spacing": [
            2,
            {}
        ],
        "space-before-blocks": [
            2,
            "always"
        ],
        "space-before-function-paren": [
            2,
            {
                "anonymous": "ignore",
                "named": "never"
            }
        ],
        "comma-spacing": [
            2,
            {
                "after": true,
                "before": false
            }
        ],
        "semi-spacing": [
            2,
            {
                "before": false,
                "after": true
            }
        ],
        "key-spacing": [
            2,
            {
                "beforeColon": false,
                "afterColon": true,
                "mode": "minimum"
            }
        ],
        "padded-blocks": [
            2,
            "never"
        ],
        "newline-after-var": 0,
        "max-len": [
            2,
            100
        ],
        "comma-style": [
            2,
            "last"
        ],
        "no-multi-str": 2,
        "wrap-iife": [
            "error",
            "any"
        ],
        "no-console": 0
    }
}
