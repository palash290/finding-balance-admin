import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  apiUrl = environment.baseUrl

  constructor(private http: HttpClient, private route: Router) { }

  setToken(token: string) {
    localStorage.setItem('fbAdminToken', token)
  }

  isLogedIn() {
    return this.getToken() !== null;
  }

  getToken() {
    return localStorage.getItem('fbAdminToken')
  }

  loginUser(url: any, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + url, params, { headers: headers });
  }

  resetPassword(url: any, params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + url, params, { headers: headers });
  }

  getApi(url: any): Observable<any> {
    const authToken = localStorage.getItem('fbAdminToken');
    const headers = new HttpHeaders({

      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + url, { headers: headers })
  };

  postAPI(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('fbAdminToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIFormData(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('fbAdminToken');
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIFormDataPatch(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('fbAdminToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.patch(this.apiUrl + url, data, { headers: headers })
  };

  logout() {
    localStorage.removeItem('fbAdminToken');
    localStorage.removeItem('adminDetailFb');
    //localStorage.removeItem('fcmFbToken');
    this.route.navigateByUrl('/login');
    localStorage.removeItem('avatar_url_fb');
    localStorage.removeItem('findPlan');
    localStorage.removeItem('plan_expired_at');
  }

    //for responsive toggle button
    private showMenuSubject = new BehaviorSubject<boolean>(false);
    showMenu$ = this.showMenuSubject.asObservable();
  
    toggleMenuVisibility() {
      this.showMenuSubject.next(!this.showMenuSubject.value);
    }
  


    
    private refreshSidebarSource = new BehaviorSubject<void | null>(null);
    refreshSidebar$ = this.refreshSidebarSource.asObservable();
  
    triggerRefresh() {
      this.refreshSidebarSource.next(null);
    }

  
}
