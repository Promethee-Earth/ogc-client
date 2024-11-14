import {
    // findChildrenElement,
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
    const rootElement = getRootElement(describeFeatureTypeDoc);
    const featureMembers = getChildrenElement(rootElement); // obtenir tous les `featureMember`
  
    const properties: Array<{ gml_id: string, fields: Record<string, string> }> = [];
  
    // Parcourir chaque `featureMember`
    featureMembers.forEach(featureMember => {
      const featureEl = getChildrenElement(featureMember)[0]; // Obtenir l'élément de la feature principale
      const gml_id = featureEl.attributes?.["gml:id"]; // Récupérer l'attribut `gml:id`
  
      if (gml_id) {
        // Initialiser un objet pour stocker les paires champ/valeur
        const fields: Record<string, string> = {};
  
        // Récupérer toutes les propriétés de `featureEl`
        getChildrenElement(featureEl).forEach(child => {
          if (child.name && child.text) {
            fields[child.name] = child.text; // Ajouter chaque champ/valeur dans `fields`
          }
        });
  
        // Ajouter les résultats avec `gml:id` et les paires champ/valeur
        properties.push({ gml_id, fields });
      }
    });
  
    return {properties};
  }