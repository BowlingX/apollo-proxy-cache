const presets = [
    [
        "@babel/env",
        {
            targets: {
                "node": "current"
            },
            useBuiltIns: "usage",
        },
    ],
];

module.exports = {
    presets, plugins: [
        require('@babel/plugin-proposal-export-default-from'),
        require('@babel/plugin-transform-flow-strip-types')
    ]
};

