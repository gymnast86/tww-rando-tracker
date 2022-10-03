import yaml from 'js-yaml';

import Settings from './settings';

class LogicLoader {
  static async loadLogicFiles() {
    const itemLocationsFile = await this._loadLogicFile('location_data.yaml');
    const macrosFile = await this._loadLogicFile('macros.yaml');
    const worldGraph = await this._loadLogicFile('world.yaml');

    return {
      itemLocationsFile,
      macrosFile,
    };
  }

  static async _loadLogicFile(fileName) {
    const fileUrl = this._logicFileUrl(fileName);
    const fileData = await this._loadFileFromUrl(fileUrl);
    const parsedFile = yaml.load(fileData);
    return parsedFile;
  }

  static async _loadFileFromUrl(url) {
    const response = await fetch(url);
    const fileData = await response.text();
    return fileData;
  }

  static _logicFileUrl(fileName) {
    return `http://localhost:8080/src/data/${fileName}`;
  }
}

export default LogicLoader;
