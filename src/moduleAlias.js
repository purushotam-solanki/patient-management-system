const moduleAlias = require('module-alias');

const alias = {
    '@': __dirname,
    '@src': `${__dirname}/`,
    '@lib': `${__dirname}/lib`,
    '@utils': `${__dirname}/lib/utils`,
    '@middlewares': `${__dirname}/lib/middlewares`,
    '@routes': `${__dirname}/routes`,
    '@controllers': `${__dirname}/controllers`,
    '@services': `${__dirname}/services`,

};

moduleAlias.addAliases(alias);
moduleAlias();

module.exports = alias;