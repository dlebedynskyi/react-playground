const isDevelopment = () => process.env.NODE_ENV === 'development';
const isProduction = () => process.env.NODE_ENV === 'production';
const isNode = config => config.target === 'node';

const isHot = () => process.env.HOT_RELOAD !== 'false';

module.exports = { isDevelopment, isProduction, isNode, isHot };
