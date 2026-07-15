import { Pipe, PipeTransform } from '@angular/core';
import {Exception} from '../models/exception';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  exceptionEntries: Exception[] = [];
  transform(collection: Array<Exception>, product :string ,quarter: string,company : string): Array<Exception> {
    this.exceptionEntries = [];
    if((product === undefined || product === '') && (quarter === undefined || quarter === '') && (company === undefined || company === '')){
      return collection;
    }
   // this.exceptionEntries = [];
    collection.forEach(exception => {  
       if((exception.quarter === quarter && exception.exchange === product) || exception.companyCode === company ){
        this.exceptionEntries.push(exception);
       }
    });
    return this.exceptionEntries;

  }

}
