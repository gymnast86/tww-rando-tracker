import _ from 'lodash';

import LOCATION_CHANGES from "../data/hd-location-changes.json";

class Locations {
  static initialize(itemLocationsFile) {
    this.locations = {};

    console.log(itemLocationsFile)

    _.forEach(LOCATION_CHANGES, (data, name) => {
      console.log(data);
      console.log(name);
      itemLocationsFile[name] = data;
    });

    console.log(itemLocationsFile);

    _.forEach(itemLocationsFile, (locationData, locationName) => {
      const {
        generalLocation,
        detailedLocation,
      } = this.splitLocationName(locationName);

      const filteredLocationData = _.pick(locationData, ['Need', 'Original item', 'Types']);

      _.forEach(filteredLocationData, (infoValue, infoKey) => {
        this.setLocation(generalLocation, detailedLocation, _.camelCase(infoKey), infoValue);
      });
    });
  }

  static initializeRaw(itemLocations) {
    this.locations = itemLocations;
  }

  static reset() {
    this.locations = null;
  }

  static KEYS = {
    NEED: 'need',
    ORIGINAL_ITEM: 'originalItem',
    TYPES: 'types',
  };

  static readAll() {
    return this.locations;
  }

  static allGeneralLocations() {
    return _.keys(this.locations);
  }

  static mapLocations(locationIteratee) {
    const newLocations = {};

    _.forEach(this.locations, (generalLocationData, generalLocationName) => {
      _.forEach(_.keys(generalLocationData), (detailedLocationName) => {
        _.set(
          newLocations,
          [generalLocationName, detailedLocationName],
          locationIteratee(generalLocationName, detailedLocationName),
        );
      });
    });

    return newLocations;
  }

  static detailedLocationsForGeneralLocation(generalLocation) {
    const generalLocationInfo = _.get(this.locations, generalLocation);

    if (!generalLocationInfo) {
      // istanbul ignore next
      throw Error(`General location not found: ${generalLocation}`);
    }

    return _.keys(generalLocationInfo);
  }

  static getLocation(generalLocation, detailedLocation, infoKey) {
    if (!_.has(this.locations, [generalLocation, detailedLocation])) {
      // istanbul ignore next
      throw Error(`Location not found: ${generalLocation} - ${detailedLocation}`);
    }

    return _.get(this.locations, [generalLocation, detailedLocation, infoKey]);
  }

  static setLocation(generalLocation, detailedLocation, infoKey, infoValue) {
    _.set(this.locations, [generalLocation, detailedLocation, infoKey], infoValue);
  }

  static splitLocationName(fullLocationName) {
    const locationMatch = fullLocationName.match(/((?:(?! - ).)+) - (.+)/);

    if (!locationMatch) {
      // istanbul ignore next
      throw Error(`Location name: "${fullLocationName}" could not be parsed!`);
    }

    return {
      generalLocation: locationMatch[1],
      detailedLocation: locationMatch[2],
    };
  }
}

export default Locations;
