import {
    findChildrenElement,
    getChildrenElement,
    getRootElement,
  } from '../shared/xml-utils.js';
  import { XmlDocument } from '@rgrove/parse-xml';
  import {
    WfsFeatureTypeName,
  } from './model.js';
  
  /**
   * Parses a DescribeFeatureType and GetFeature (with hits) document
   * This requires providing the base feature type object from the GetCapabilities document
   */
  export function parseFeatureTypeName(
    describeFeatureTypeDoc: XmlDocument,
  ): WfsFeatureTypeName {


    console.log('AZERTY');
    // const featureMembers = findChildrenElement(
    //     getRootElement(describeFeatureTypeDoc),
    //     'featureMember',
    //     true
    //   )[0];
    const featureMembers = getChildrenElement(getRootElement(describeFeatureTypeDoc))[0];
    
        const featureEl = getChildrenElement(featureMembers)[0];
        const propertiesEls = getChildrenElement(featureEl);
    
        // Récupère chaque propriété et sa valeur sous forme de clé-valeur
        const properties = propertiesEls.reduce((prev, curr) => ({
            ...prev,
            [curr.name]: curr.text,
          }),
          {}
        );
        return {properties};
    }
    

    // let properties;
    // complexTypeEl.map((complexTypeEl) => {
    //     const featureEl = findChildrenElement(complexTypeEl, '*', true)[0];
    //     console.log(featureEl);
    //     const propertiesEls = findChildrenElement(featureEl, '*', true);
    //     console.log(propertiesEls);
    
    //     // Récupère chaque propriété et sa valeur sous forme de clé-valeur
    //     properties = propertiesEls.reduce((acc, el) => {
    //       const propertyName = el.name;
    //       const propertyValue = el.text;
    //       return {
    //         ...acc,
    //         [propertyName]: propertyValue,
    //       };
    //     }, {});
    
    //   });
    // }
    // return properties;
    
  
//   function getTypeFromXsdType(xsdType: string): FeaturePropertyType {
//     const xsdTypeNoNamespace =
//       xsdType.indexOf(':') > -1
//         ? xsdType.substr(xsdType.indexOf(':') + 1)
//         : xsdType;
  
//     switch (xsdTypeNoNamespace) {
//       case 'string':
//         return 'string';
//       case 'boolean':
//         return 'boolean';
//       case 'float':
//       case 'double':
//       case 'decimal':
//         return 'float';
//       case 'long':
//       case 'byte':
//       case 'integer':
//       case 'int':
//       case 'positiveInteger':
//       case 'negativeInteger':
//       case 'nonPositiveInteger':
//       case 'nonNegativeInteger':
//       case 'short':
//       case 'unsignedLong':
//       case 'unsignedInt':
//       case 'unsignedShort':
//       case 'unsignedByte':
//         return 'integer';
//       default:
//         return 'string';
//     }
//   }
  
//   function getGeomTypeFromGmlType(gmlType: string): FeatureGeometryType {
//     const gmlTypeNoNamespace =
//       gmlType.indexOf(':') > -1
//         ? gmlType.substr(gmlType.indexOf(':') + 1)
//         : gmlType;
  
//     // these should cover types in GML2 to 3.2
//     switch (gmlTypeNoNamespace) {
//       case 'PointPropertyType':
//         return 'point';
//       case 'MultiPointPropertyType':
//         return 'multipoint';
//       case 'CurvePropertyType':
//       case 'LineStringPropertyType':
//         return 'linestring';
//       case 'MultiCurvePropertyType':
//       case 'MultiLineStringPropertyType':
//         return 'linestring';
//       case 'PolygonPropertyType':
//       case 'SurfacePropertyType':
//         return 'polygon';
//       case 'MultiPolygonPropertyType':
//       case 'MultiSurfacePropertyType':
//         return 'multipolygon';
//       default:
//         return 'unknown';
//     }
//   }
  