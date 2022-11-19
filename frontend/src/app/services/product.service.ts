import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = environment.apiURL;
  private token = this.authService.getAccessToken();
  private httpOptions = {
    headers: new HttpHeaders({
      'x-access-token': this.token,
    }),
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/product/all`, this.httpOptions);
  }

  public getAllUserProducts(): Observable<any> {
    return this.http.get<any>(
      `${this.apiURL}/product/user/all`,
      this.httpOptions
    );
  }

  public deleteUserProduct(productId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiURL}/product/user/delete/${productId}`,
      this.httpOptions
    );
  }

  public addUserProduct(product: Product): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}/product/user/add`,
      product,
      this.httpOptions
    );
  }

  public deleteAllUserProducts(): Observable<any> {
    return this.http.delete<any>(
      `${this.apiURL}/product/user/all/delete`,
      this.httpOptions
    );
  }
}
