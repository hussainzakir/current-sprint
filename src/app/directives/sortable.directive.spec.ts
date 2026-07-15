import { NgbdSortableHeader } from './sortable.directive';
describe('SortableDirective', () => {
  it('should create an instance', () => {
    const directive = new NgbdSortableHeader();
    expect(directive).toBeTruthy();
  });
  it("should rotate", () => {
    const directive = new NgbdSortableHeader();
    directive.direction = "desc";
    directive.rotate();
    expect(directive.rotate).toBeDefined();
  });
});
