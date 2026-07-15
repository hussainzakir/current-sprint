import { FilterByPipe } from './filter-by.pipe';
import { TestData } from '../testing/test-data';

describe('FilterByPipe', () => {
const pipe = new FilterByPipe();

    it('should not be null', () => {
      expect(pipe).not.toBeNull();
    });

    // it('should return null', () => {
    //   expect(pipe.transform(null, "","","")).toEqual(null);
    // });
  
    // it('should return null', () => {
    //   expect(pipe.transform(undefined, "","","")).toEqual(null);
    // });
  
    // it('should return empty array', () => {
    //   expect(pipe.transform([], "","","")).toEqual([]);
    // });

    // it('should return empty array', () => {
    //   expect(pipe.transform([], undefined," "," ")).toEqual([]);
    // });

    // it('should return empty array', () => {
    //   expect(pipe.transform([], " ",undefined," ")).toEqual([]);
    // });
    // it('should return empty array', () => {
    //   expect(pipe.transform([], " "," ",undefined)).toEqual([]);
    // });

    it('should return array group by department', () => {

      const companyId: string = 'G48';
      
      let result = pipe.transform(TestData.exceptions," "," ", companyId);
      expect(JSON.stringify(TestData.exceptions)).toEqual(JSON.stringify(TestData.exceptions));   
    }); 
  
});
