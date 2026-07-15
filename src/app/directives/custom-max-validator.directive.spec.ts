import { FormControl } from '@angular/forms';
import { CustomMaxValidatorDirective } from './custom-max-validator.directive';

describe('CustomMaxValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomMaxValidatorDirective();
    expect(directive).toBeTruthy();
    directive.customMax = 11;
    const control = new FormControl(12);
    directive.validate(control);
    expect(directive.validate).toBeDefined();
  });
});
