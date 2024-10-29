import { setQueryParams } from '../shared/http-utils.js';

export default class WfsTransactionalEndpoint {
  private _transactionalUrl: string;

  constructor(url: string) {
    this._transactionalUrl = setQueryParams(url, {
      SERVICE: 'WFS',
      REQUEST: 'Transaction',
    });
  }

  async deleteFeature(typeName: string, featureId: string): Promise<void> {

    // const deleteRequest = `
    //     <wfs:Transaction     
    //       xmlns:wfs="http://www.opengis.net/wfs" 
    //       xmlns:gml="http://www.opengis.net/gml" 
    //       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    //         xmlns:ogc="http://www.opengis.net/ogc"
    //       service="WFS" 
    //       version="1.1.0" 
    //       xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
          
    //       <wfs:Delete 
    //         typeName="ns1:${typeName}"
    //         xmlns:ns1="https://gis.eop.promethee.digital/examind/WS/wfs/EOP_WFS">
            
    //         <ogc:Filter>
    //           <ogc:FeatureId fid="${featureId}"/>
    //         </ogc:Filter>
          
    //       </wfs:Delete>
    //     </wfs:Transaction>`;

    console.log(typeName, featureId);
    const deleteRequest = 

    // `<wfs:Transaction
    //     version="2.0.02.0.2"
    //     service="WFS"
    //     xmlns="http://www.someserver.example.com/myns"
    //     xmlns:fes="http://www.opengis.net/fes/2.0"
    //     xmlns:wfs="http://www.opengis.net/wfs/2.0"
    //     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    //     xsi:schemaLocation="http://www.opengis.net/wfs/2.0
    //                         http://schemas.opengis.net/wfs/2.0.02.0/wfs.xsd">
    //     <wfs:Update typeName="${typeName}">
    //       <wfs:Property>
    //           <wfs:ValueReference>population</wfs:ValueReference>
    //           <wfs:Value>4070000</wfs:Value>
    //       </wfs:Property>
    //       <fes:Filter>
    //           <fes:ResourceId rid="${typeName}.10131"/>
    //       </fes:Filter>
    //     </wfs:Update>
    // </wfs:Transaction>`;


    `<wfs:Transaction
      version="2.0.0"
      service="WFS"
      xmlns:fes="http://www.opengis.net/fes/2.0"
      xmlns:wfs="http://www.opengis.net/wfs/2.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs/2.0
                          http://schemas.opengis.net/wfs/2.0/wfs.xsd">
      <wfs:Delete typeName="${typeName}">
          <fes:Filter>
            <fes:ResourceId rid="${typeName}.ville"/>
          </fes:Filter>
      </wfs:Delete>
    </wfs:Transaction>`;
    
      // `<wfs:Transaction
      //   version="1.1.0"
      //   service="WFS"
      //   xmlns:sampling="http://www.opengis.net/sampling/1.0"
      //   xmlns:ogc="http://www.opengis.net/ogc"
      //   xmlns:gml="http://www.opengis.net/gml"
      //     xmlns:wfs="http://www.opengis.net/wfs"
      //     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      //     xsi:schemaLocation="http://www.opengis.net/wfs ../wfs/1.1.0/WFS.xsd">
      //       <wfs:Delete typeName="${typeName}">
      //           <ogc:Filter>
      //                 <ogc:PropertyIsEqualTo>
      //                     <ogc:PropertyName>gml:name</ogc:PropertyName>
      //                     <ogc:Literal>ville</ogc:Literal>
      //                 </ogc:PropertyIsEqualTo>
      //           </ogc:Filter>
      //       </wfs:Delete>
      //   </wfs:Transaction>`;
    
    
      // `<Transaction service="WFS" version="1.1.0"
      //   xmlns="http://www.opengis.net/wfs"
      //   xmlns:gml="http://www.opengis.net/gml"
      //   xmlns:ogc="http://www.opengis.net/ogc"
      //   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      //   xsi:schemaLocation="http://www.opengis.net/wfs
      //   http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
      //   <Delete typeName="${typeName}">
      //     <ogc:Filter>
      //       <ogc:PropertyIsEqualTo>
      //       <ogc:PropertyName>gml:name</ogc:PropertyName>
      //       <ogc:Literal>ville</ogc:Literal>
      //       </ogc:PropertyIsEqualTo>
      //     </ogc:Filter>
      //   </Delete>
      // </Transaction>-`;

    const response = await fetch(this._transactionalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: deleteRequest,
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la suppression de la feature : ${response.statusText}`
      );
    }
  }
}
