import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { TableCellEditor } from './datatable.util';

declare var $: any;

@Component({
  selector: '[datatable]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  @Input() public options: any;
  @Output() public current = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.render();
  }


  private render() {
    const elem = $(this.el.nativeElement);

    this.loadConfiguration();

    const table = elem.DataTable(this.options.data);
    this.selectCurrentData(elem, table);

    table.on('xhr.dt', (e, settings, data) => table.clear())

    if (this.options.searches)
      this.searches(elem, table);

    if (this.options.editor)
      this.editor(elem);
  }

  private loadConfiguration() {
    const options = {
      deferRender: true,
      // pagingType: 'simple',
      destroy: true,
      responsive: this.options.responsive,
      columnDefs: this.options.select ? [{
        orderable: false,
        className: 'select-checkbox',
        targets: 0
      }] : [],
      select: this.options.select ? {
        style: 'multi',
        selector: 'td:first-child'
      } : false
    };

    this.options.data = { ...this.options.data, ...options };
  }

  private selectCurrentData(elem, table) {
    elem.find('tbody').on('click', 'tr', (evt) => {
      $(evt.currentTarget).addClass("highlight");
      var data = table.row(evt.currentTarget).data();
      this.current.emit(data);
    });
  }

  private searches(elem, table) {
    const head = elem.find('thead tr:first-child');
    const headChils = Array.from(head.find(this.options.select ? 'th:not(:first-child)' : 'th'));
    headChils.forEach(e => $(e).html("<input type='text' class='form-control input-sm' style='width:100%'/>"));

    table.columns().every(i => {
      const column = table.columns(i);
      const input = $('input', head)[i - 1];
      if (input != undefined)
        $(input).on('keyup change clear', (evt) => {
          if (column.search() !== evt.currentTarget.value) {
            column.search(evt.currentTarget.value).draw();
          }
        });
    });
  }

  private editor(elem) {
    const cellEditor = new TableCellEditor(elem, {});
    cellEditor.SetEditableClass(this.options.editor.numeric.className, { validation: $.isNumeric });
    cellEditor.SetEditableClass(this.options.editor.string.className, {});
  }
}
