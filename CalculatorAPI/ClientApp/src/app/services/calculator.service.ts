import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CalculationDto } from '../dto/CalculationDto';
import { ICalculationDto } from '../dto/ICalculationDto';

//mag natuurlijk niet in real life 
const baseUrl: string = 'https://localhost:44355';

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    public CalculationChanged = new EventEmitter;

    public get _baseUrl(): string {
        return baseUrl + '/api/calculation';
    }

    constructor(private _http: HttpClient) { }

    calculate(infix: CalculationDto): Observable<CalculationDto> {
        const result = this._http.post<CalculationDto>(this._baseUrl, infix);
        return result
            .pipe(tap((result: CalculationDto) => {
                console.log(JSON.stringify(result));
                if (result) {
                    this.CalculationChanged.next();
                }
            })
               , catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse): Observable<never> {

        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            //beetje kort door de bocht :-)
            if (err.error.errors)
                errorMessage = err.error.errors.Infix[0];
            else 
                errorMessage = err.error;    

        }
       
        return throwError(errorMessage);
    }
}