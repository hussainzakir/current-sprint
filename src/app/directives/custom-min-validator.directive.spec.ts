import { FormControl } from '@angular/forms';
import { CustomMinValidatorDirective } from './custom-min-validator.directive';

describe('CustomMinValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomMinValidatorDirective();
    expect(directive).toBeTruthy();
    directive.customMin = 13;
    const control = new FormControl(12);
    directive.validate(control);
    expect(directive.validate).toBeDefined();
  });
});
