import TokenGenerator from 'uuid-token-generator';

const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);

export default tokgen;