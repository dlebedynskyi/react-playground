let ENV = {};

export function configureENV(config) {
  ENV = config;
}

export function getENV() {
  return ENV;
}

export default getENV;
