import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class BaseService {
  constructor(protected http: HttpClient) { }

  getRequest(url: string, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    if (params) {
      params['spinneroff'] = spinneroff ? '1' : '0'
    } else {
      params = {
        spinneroff: spinneroff ? '1' : '0'
      }
    }
    return this.http.get(url, { params, ...requestOptions });
  }

  postRequest(url: string, body?: any, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    if (params) {
      params['spinneroff'] = spinneroff ? '1' : '0'
    } else {
      params = {
        spinneroff: spinneroff ? '1' : '0'
      }
    }
    return this.http.post(url, body, {
      params,
      ...requestOptions,
      responseType: 'json',
      withCredentials: true 
    });
  }

  putRequest(url: string, body?: any, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    if (params) {
      params['spinneroff'] = spinneroff ? '1' : '0'
    } else {
      params = {
        spinneroff: spinneroff ? '1' : '0'
      }
    }
    return this.http.put(url, body, { params, withCredentials: true });
  }

  deleteRequest(url: string, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const requestOptions = {
      headers: new HttpHeaders(headers),
    };
    params ??= {
      ...params,
      spinneroff: spinneroff ? '1' : '0'
    }
    return this.http.delete(url, { params, ...requestOptions, withCredentials: true });
  }

  postRequestFile(url: string, file: FormData, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    params ??= {
      ...params,
      spinneroff: spinneroff ? '1' : '0'
    }
    return this.http.post(url, file, { params, withCredentials: true });
  }

  getRequestFile(url: string, params?: any, spinneroff?: 'spinneroff'): Observable<File> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });
    if (params) {
      params['spinneroff'] = spinneroff ? '1' : '0'
    } else {
      params = {
        spinneroff: spinneroff ? '1' : '0'
      }
    }
    return this.http
      .get(url, {
        observe: 'response',
        headers: headers,
        params,
        responseType: 'blob',
      }).pipe(
        map((res: any) => {
          let filename = 'download'
          const content_disposition = res.headers.get('Content-Disposition');
          const extract = content_disposition?.toString()?.split(';')[1];
          filename = extract?.split('=')[1]?.trim()?.replace(/(^"|"$)/g, '');
          const blob = new Blob([res.body], {
            type: 'application/octet-stream',
          });
          const file = new File([blob], filename, { type: blob.type });
          return file;
        })
      );
  }

  getRequestDownloadFile(url: string, params?: any, spinneroff?: 'spinneroff'): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });
    if (params) {
      params['spinneroff'] = spinneroff ? '1' : '0'
    } else {
      params = {
        spinneroff: spinneroff ? '1' : '0'
      }
    }
    return this.http
      .get(url, {
        observe: 'response',
        headers: headers,
        params,
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((res: any) => {
          const content_disposition = res.headers.get('Content-Disposition');
          const extract = content_disposition.toString().split(';')[1];
          const filename = extract
            .split('=')[1]
            .trim()
            .replace(/(^"|"$)/g, '');
          const blob = new Blob([res.body], {
            type: 'application/octet-stream',
          });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64 = reader.result;
            const source = base64!.toString();
            let link: any = document.createElement('a');
            link.id = 'pdfLink' + filename;
            link.href = source;
            link.download = filename.toString();
            link.click();
            link = null;
          };
        })
      );
  }
}
