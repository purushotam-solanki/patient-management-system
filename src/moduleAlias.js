const moduleAlias = require('module-alias');

const alias = {
    '@': __dirname,
    '@src': `${__dirname}/`,
    '@lib': `${__dirname}/lib`,
    '@utils': `${__dirname}/lib/utils`,
    '@middlewares': `${__dirname}/lib/middlewares`,
};

moduleAlias.addAliases(alias);
moduleAlias();

module.exports = alias;