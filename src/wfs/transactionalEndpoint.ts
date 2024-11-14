import { setQueryParams } from '../shared/http-utils.js';

export default class WfsTransactionalEndpoint {
  private _transactionalUrl: string;
  private _token: Promise<string>;

  constructor(url: string, typename: string) {
    this._transactionalUrl = setQueryParams(url, {
      SERVICE: 'WFS',
      REQUEST: 'Transaction',
      VERSION: '2.0.0',
      TYPENAME: typename,
    });
  }

  async deleteFeature(
    typeName: string,
    propertyName: string,
    featureId: string
  ): Promise<void> {
    const deleteData = `<wfs:Transaction service="WFS" version="2.0.0"
        xmlns:wfs="http://www.opengis.net/wfs/2.0"
        xmlns:fes="http://www.opengis.net/fes/2.0">
        <wfs:Delete typeName="${typeName}">
            <fes:Filter>
                <fes:PropertyIsEqualTo>
                    <fes:ValueReference>${propertyName}</fes:ValueReference>
                    <fes:Literal>${featureId}</fes:Literal>
                </fes:PropertyIsEqualTo>
            </fes:Filter>
        </wfs:Delete>
    </wfs:Transaction>`;

    const response = await fetch(this._transactionalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        Cookie: 'access_token=',
      },
      body: deleteData,
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la suppression de la feature : ${response.statusText}`
      );
    }
  }
}
