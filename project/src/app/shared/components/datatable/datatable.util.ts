
declare let $: any;

export class TableCellEdition {
   public Elem: any;
   public oldContent: any;
   public oldValue: any;
   public cellParams: any;

   constructor(elem, cellParams) {
      this.Elem = elem;
      this.oldContent = $(elem).html();
      this.oldValue = cellParams.internals.extractValue(elem);
      this.cellParams = cellParams;
   }

}

export class TableCellEditor {

   private active: boolean;
   private Elem: any;
   private params: any;
   private CellEdition: any;
   private EditionEndOrigin: any;
   private editableClasses: Array<string>;
   private isDataTable: boolean;

   constructor(elem, params) {

      let self = this;

      self.EditionEndOrigin = {
         OutsideTable: 1,
         AnotherCell: 2
      };

      self.editableClasses = [];

      this.active = true;
      this.Elem = elem;

      this.params = self.GetExtendedEditorParams(params);
      this.CellEdition = null;

      this.TryHandleDataTableReloadEvent();

      $(document).mouseup(function (e) {
         if (!self.Elem.is(e.target) && self.Elem.has(e.target).length === 0)
            self.FreeCurrentCell(self.EditionEndOrigin.OutsideTable);
      });
   }

   SetEditable(elem, params) {
      let self = this;
      if (!self.isValidElem(elem)) return;

      let cellParams = self.GetExtendedCellParams(params);

      $(elem).on('dblclick', function (evt) {
         if (!self.active) return;
         if ($(this).hasClass(self.params.inEditClass)) return;

         self.EditCell(this, cellParams);
      });


      $(elem).on('keydown', function (event) {
         if (!self.active) return;
         if (!$(this).hasClass(self.params.inEditClass)) return;

         self.HandleKeyPressed(event, this, cellParams);
      });

   }

   SetEditableClass(editableClass, params) {
      let self = this;
      let cellParams = self.GetExtendedCellParams(params);
      self.editableClasses.push(`.${editableClass}`)
      self.Elem.on('dblclick', `td.${editableClass}:not(.${self.params.inEditClass})`, function () {
         if (!self.active) return;
         self.EditCell(this, cellParams);
      });

      self.Elem.on('keydown', `td.${editableClass}.${self.params.inEditClass}`, function (event) {
         if (!self.active) return;
         self.HandleKeyPressed(event, this, cellParams);
      });
   }

   Toggle(active) {

      if (typeof (active) === 'undefined')
         active = !this.active;

      this.active = active;

   }

   HandleKeyPressed(event, elem, cellParams) {
      let self = this;

      let which = event.which
      let shift = event.shiftKey
      let colIndex = $(elem).closest('td').index()
      let rowIndex = $(elem).closest('tr').index()
      let moveNext = false
      let movePrevious = false
      let moveDown = false
      let moveUp = false

      if (self.params.navigation && self.editableClasses.length !== 0) {

         if (cellParams.behaviour.arrowKeyCauseCursorMove && shift) {
            if (which === 39)
               moveNext = true
            else if (which === 37)
               movePrevious = true
            else if (which === 40)
               moveDown = true
            else if (which === 38)
               moveUp = true
         }
         if (cellParams.behaviour.tabKeyCauseCursorMove) {
            if (which === 9) {
               if (!shift)
                  moveNext = true
               else
                  movePrevious = true
            }
         }

         if (moveNext || movePrevious || moveDown || moveUp) {
            event.preventDefault()
            let $tableElementsArray = $(elem).closest('table').find(self.editableClasses.join(','))

            let visibleBoxes = []
            $.each($tableElementsArray, function () {
               if ($(this).is(":visible")) {
                  visibleBoxes.push(this);
               }
            })
            let $visibleBoxes = $(visibleBoxes)
            let elemIndex = $visibleBoxes.index($(elem))
            let $obj
            if (moveNext) {
               elemIndex++
               if (elemIndex === $visibleBoxes.length)
                  elemIndex = 0
            }
            else if (movePrevious) {
               elemIndex--
               if (elemIndex < 0)
                  elemIndex = $visibleBoxes.length - 1
            } else if (moveDown || moveUp) {
               let colBoxes = []
               $.each($visibleBoxes, function () {
                  if ($(this).closest('td').index() === colIndex) {
                     colBoxes.push(this);
                  }
               })
               let $colBoxes = $(colBoxes)
               let myIndex = $colBoxes.index($(elem))
               if (moveDown) {
                  myIndex++
                  if (myIndex === $colBoxes.length)
                     myIndex = 0
               }
               else if (moveUp) {
                  myIndex--
                  if (myIndex < 0)
                     myIndex = $colBoxes.length - 1
               }
               let elemIndex = $visibleBoxes.index($($colBoxes[myIndex]))
            }
            $obj = $($visibleBoxes[elemIndex])
            this.FreeCell(elem, cellParams, true)

            $obj.click()
            return
         }
      }

      if (cellParams.keys.validation.includes(which))
         this.FreeCell(elem, cellParams, true);

      else if (cellParams.keys.cancellation.includes(which))
         this.FreeCell(elem, cellParams, false);

   }

   EditCell(elem, cellParams) {

      let onEditEnterEvent = this.FireOnEditEnterEvent(elem);

      if (onEditEnterEvent.isDefaultPrevented()) return;

      this.FreeCurrentCell(this.EditionEndOrigin.AnotherCell);

      this.CellEdition = new TableCellEdition(elem, cellParams);

      if (this.isDataTable)
         this.CellEdition.cellIndex = this.Elem.DataTable().cell($(elem)).index();

      let oldVal = cellParams.internals.extractValue(elem);

      $(elem).addClass(this.params.inEditClass);

      cellParams.internals.renderEditor(elem, oldVal);

      this.FireOnEditEnteredEvent(elem, oldVal);
   }

   EndEditCell(elem, cellParams) {
      this.FreeCell(elem, cellParams, true);
   }

   CancelEditCell(elem, cellParams) {
      this.FreeCell(elem, cellParams, false);
   }

   FreeCell(elem, cellParams, keepChanges) {

      if (!this.isValidElem(elem) || this.CellEdition === null)
         return;

      let onEditExitEvent = this.FireOnEditExitEvent(elem, this.CellEdition.oldValue);
      if (onEditExitEvent.isDefaultPrevented())
         return;

      let newVal = cellParams.internals.extractEditorValue(elem);

      $(elem).removeClass(this.params.inEditClass);
      $(elem).html('');

      if (!cellParams.validation(newVal) || this.CellEdition.oldValue === newVal)
         keepChanges = false;

      let formattedNewVal = cellParams.formatter(newVal);

      this.FireOnEditExitedEvent(elem, this.CellEdition.oldValue, formattedNewVal, keepChanges);

      if (keepChanges) {

         cellParams.internals.renderValue(elem, formattedNewVal);

         this.FireEditedEvent(elem, this.CellEdition.oldValue, formattedNewVal);

      }
      else {
         $(elem).html(this.CellEdition.oldContent);

      }

      this.CellEdition = null;
   }

   FreeCurrentCell(editionEndOrigin) {

      let current = this.GetCurrentEdition();

      if (current === null)
         return;

      let keepChanges = true;

      if (editionEndOrigin === this.EditionEndOrigin.OutsideTable && current.cellParams.behaviour.outsideTableClickCauseCancellation)
         keepChanges = false;

      if (editionEndOrigin === this.EditionEndOrigin.AnotherCell && current.cellParams.behaviour.anotherCellClickCauseCancellation)
         keepChanges = false;

      this.FreeCell(current.Elem, current.cellParams, keepChanges);
   }

   GetCurrentEdition() {

      return (this.CellEdition === null ? null : this.CellEdition);
   }

   GetExtendedEditorParams(params) {

      let self = this;

      return $.extend(true, {}, self.GetDefaultEditorParams(), params);

   }

   GetExtendedCellParams(cellParams) {

      let self = this;

      return $.extend(true, {}, self.GetDefaultCellParams(), cellParams);

   }

   FireOnEditEnterEvent(elem) {
      let evt = $.Event("cell:onEditEnter", { element: elem });
      this.Elem.trigger(evt);
      return evt;
   }

   FireOnEditEnteredEvent(elem, oldVal) {
      this.Elem.trigger({
         type: "cell:onEditEntered",
         element: elem,
         oldValue: oldVal
      });
   }

   FireOnEditExitEvent(elem, oldVal) {
      let evt = $.Event("cell:onEditExit", { element: elem, oldValue: oldVal });
      this.Elem.trigger(evt);
      return evt;
   }

   FireOnEditExitedEvent(elem, oldVal, newVal, applied) {
      this.Elem.trigger({
         type: "cell:onEditExited",
         element: elem,
         newValue: newVal,
         oldValue: oldVal,
         applied: applied
      });
   }

   FireEditedEvent(elem, oldVal, newVal) {
      this.Elem.trigger({
         type: "cell:edited",
         element: elem,
         newValue: newVal,
         oldValue: oldVal
      });

      this.Elem.DataTable().cell($(elem)).data(newVal);
   }

   TryHandleDataTableReloadEvent() {
      let self = this;
      this.isDataTable = false;

      try {
         if ($.fn.DataTable.isDataTable(self.Elem))
            self.isDataTable = true;
      } catch (e) {
         return;
      }

      if (self.isDataTable)
         self.Elem.on('draw.dt', function () {
            if (self.CellEdition !== null && self.CellEdition.Elem !== null) {
               let node = self.Elem.DataTable().cell(self.CellEdition.cellIndex).node();
               self.EditCell(node, self.CellEdition.cellParams);

            }
         });
   }

   GetDefaultEditorParams() {
      return {
         inEditClass: "inEdit",
         navigation: true
      };
   }

   GetDefaultCellParams() {

      return {
         validation: (value) => { return true; },
         formatter: (value) => { return value; },
         keys: {
            validation: [13],
            cancellation: [27]
         },
         behaviour: {
            tabKeyCauseCursorMove: true,
            arrowKeyCauseCursorMove: true,
            outsideTableClickCauseCancellation: false,
            anotherCellClickCauseCancellation: false
         },
         internals: this.GetDefaultInternals()
      };
   }

   GetDefaultInternals() {
      return {
         renderValue: (elem, formattedNewVal) => { $(elem).text(formattedNewVal); },
         renderEditor: (elem, oldVal) => {
            $(elem).html(`<input type='text' class='form-control input-sm' style="width:100%;">`);
            let input = $(elem).find('input');
            input.focus();
            input.val(oldVal);
         },
         extractEditorValue: (elem) => { return $(elem).find('input').val(); },
         extractValue: (elem) => { return $(elem).text(); }
      };

   }

   isValidElem(elem) {
      return (elem !== null && typeof elem !== 'undefined' && $(elem).length > 0);
   }

}