import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DistanceMatrix } from '../../interfaces/distance-matrix';

@Injectable({
  providedIn: 'root',
})
export class DistanceMatrixService {
  protected distancia: number = 0;

  private your_access_token: string =
    'eCPTW8BeWajYjUI2QaNn1plUiMAQC1EGsxMSCAnrNfbjU8XYtIJ04Su7YDDEVGqG';
  private citydeposit = 'Mar del Plata';
  private provinceDeposit = 'Buenos Aires';
  private countryDeposit = 'Argentina';
  private streetDeposit = 'San Luis';
  private numberStreetDeposit = '4124';
  private addressDeposit: string =
    this.streetDeposit +
    ' ' +
    this.numberStreetDeposit +
    ', ' +
    this.citydeposit +
    ', ' +
    this.provinceDeposit +
    ', ' +
    this.countryDeposit;

  distanceMatrixObject: DistanceMatrix;
  calculatedDistance: number;

  constructor(private httpClient: HttpClient) {
    this.distanceMatrixObject = {
      destination_addresses: [''],
      origin_addresses: [''],
      rows: [
        {
          elements: [
            {
              distance: {
                text: '',
                value: 0,
              },
              duration: {
                text: '',
                value: 0,
              },
              origin: '',
              destination: '',
              status: '',
            },
          ],
        },
      ],
      status: '',
    };

    this.calculatedDistance = 0;
  }

  private generateUrlDistance(origen: string, destino: string) {
    //origen y destino en formato string de calle numero, ciudad, provincia, pais

    return (
      'https://api.distancematrix.ai/maps/api/distancematrix/json?origins=' +
      origen +
      '&destinations=' +
      destino +
      '&key=' +
      this.your_access_token
    );
  }

  public getApiDistanceMatrix(destino: string): Promise<any> {
    return this.httpClient
      .get(this.generateUrlDistance(this.addressDeposit, destino))
      .toPromise();
  }
}
